const express = require('express');
const { bookingController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { bookingValidation } = require('../../validations');

const router = express.Router();

router.post('/', validate(bookingValidation.createBooking), bookingController.createBooking);
router.get('/', auth('getBookings'), validate(bookingValidation.getBookings), bookingController.getBookings);
router.get('/:bookingId', auth('getBooking'), validate(bookingValidation.getBooking), bookingController.getBooking);
router.post('/update/:bookingId', auth('manageBooking'), validate(bookingValidation.updateBooking), bookingController.updateBooking);
router.post('/delete/:bookingId', auth('manageBooking'), validate(bookingValidation.deleteBooking), bookingController.deleteBooking);

module.exports = router;