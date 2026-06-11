const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const { Enums } = require('../utils/common');
const { Booking } = require('../models');
const AppError = require('../utils/errors/App-error');
const { StatusCodes } = require('http-status-codes');

async function createBooking(data) {
    try {
        await axios.patch(
            `${process.env.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,
            {
                seats: data.noOfSeats,
                dec: true
            }
        );
        const flight=await axios.get(
            `${process.env.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`,
        )
        const flightData=flight.data.data;
        const booking = await Booking.create({
            flightId: data.flightId,
            userId: data.userId,
            noOfSeats: data.noOfSeats,
            status: Enums.BOOKING_STATUS.PENDING,
            totalcost:data.noOfSeats*flightData.price
        });
        let paymentSuccessful = true;
        if (paymentSuccessful) {

            booking.status = Enums.BOOKING_STATUS.BOOKED,
            await booking.save();

            return booking;
        }
        await axios.patch(
            `${process.env.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,
            {
                seats: data.noOfSeats,
                dec: false
            }
        );
        booking.status = Enums.BOOKING_STATUS.CANCELLED;
        await booking.save();
        throw new AppError(
            'Payment failed',
            StatusCodes.BAD_REQUEST
        );

    } catch (error) {

        if (error instanceof AppError) {
            throw error;
        }
        if (error.response) {
            throw new AppError(
                error.response.data.message || 'Flight service error',
                error.response.status || StatusCodes.BAD_REQUEST
            );
        }
        throw new AppError(
            error.message,
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    createBooking
};