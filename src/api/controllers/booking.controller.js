const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { bookingService } = require("../services");

const createBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.createBooking(req.body);
  res.status(httpStatus.CREATED).send({ status: true, code: "0000", booking });
});

const getBookings = catchAsync(async (req, res) => {
  const options = pick(req.query, ["sort", "limit", "page"]);
  const result = await bookingService.getAllBooking(options);
  res.send({ status: true, code: "0000", result });
});

const getBooking = catchAsync(async (req, res) => {
  const result = await bookingService.getBookingById(req.params.bookingId);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
  }
  res.send({ status: true, code: "0000", result });
});

const updateBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.updateBookingById(
    req.params.bookingId,
    req.body
  );
  res.send({ status: true, code: "0000", booking });
});

const deleteBooking = catchAsync(async (req, res) => {
  await bookingService.deleteBookingById(req.params.bookingId);
  res.send({
    status: true,
    code: "0000",
    message: "Booking successfully deleted",
  });
});

module.exports = {
  createBooking,
  getBooking,
  getBookings,
  updateBooking,
  deleteBooking,
};
