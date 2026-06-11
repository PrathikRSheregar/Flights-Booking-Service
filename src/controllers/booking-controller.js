const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../services');

async function createBooking(req, res) {
    try {
        const { flightId, userId, noOfSeats } = req.body;
        const response = await BookingService.createBooking({
            flightId,
            userId,
            noOfSeats
        });

        return res.status(StatusCodes.OK).json({
            success: true,
            data: response,
            message: 'Booking created successfully'
        });

    } catch (error) {
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: error.message || 'Something went wrong'
        });
    }
}

module.exports = {
    createBooking
};