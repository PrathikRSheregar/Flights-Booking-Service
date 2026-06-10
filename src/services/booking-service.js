const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const AppError = require("../utils/errors/App-error");
const db = require("../models");
const { StatusCodes } = require("http-status-codes");

async function createBooking(data) {
    try {
        return await db.sequelize.transaction(async (t) => {

            // 1. Call flight service
            const flight = await axios.get(
                `${process.env.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
            );

            const flightData = flight.data.data;

            // 2. Validate seats
            if (data.noOfSeats > flightData.remainingSeats) {
                throw new AppError(
                    "Not enough seats available",
                    StatusCodes.BAD_REQUEST
                );
            }

            // 3. (IMPORTANT) reserve seats in flight service
            // await axios.post(... reserve API)

            // 4. create booking in DB (example)
            // const booking = await db.Booking.create({...}, { transaction: t });

            return true;
        });

    } catch (error) {
        throw error;
    }
}

module.exports = {
    createBooking
};