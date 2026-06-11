function validateBooking(req,res,next){
    if (!req.body|| !req.body.flightId || !req.body.userId || !req.body.noOfSeats) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "flightId, userId and seats are required"
        });
    }
    next();
}
module.exports={
    validateBooking
}