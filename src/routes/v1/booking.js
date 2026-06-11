const express = require('express');
const router = express.Router();
const { BookingController }=require('../../controllers');
const { bookingMiddleware } = require('../../middlewares');

router.post(
    '/',
    bookingMiddleware.validateBooking,
    BookingController.createBooking
)

module.exports = router;