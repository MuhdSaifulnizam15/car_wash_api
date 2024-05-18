const httpStatus = require("http-status");
const { Booking } = require("../models");
const { default: axios } = require("axios");
const ApiError = require("../utils/ApiError");
const { generateShortUUID } = require("../utils/uniqueIdGenerator");
const config = require("../../config/config");

const createBooking = async (body) => {
  if (await Booking.isActiveCarPlateOrder(body.car_plate)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "There is an active order for this car plate. Only one order allowed for every car plate. Please contact our administrator for any issue.");
  }

  const _payload = { 
    ...body, 
    status: body.status ?? 'booked',
    code: generateShortUUID(), 
  }

  const booking = await Booking.create(_payload);

  if(_payload.status === 'booked') {
    // send whatsapp to phone number
    const data = JSON.stringify({
      messaging_product: "whatsapp",
      to: "6" + _payload.phone_no,
      type: "template",
      template: {
        name: "statement_available_2",
        language: {
          code: "my",
        },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: _payload.name,
              },
              {
                type: "text",
                text: _payload.car_plate,
              },
              {
                type: "text",
                text: _payload.phone_no,
              },
              {
                type: "text",
                text: _payload.code,
              },
            ],
          },
        ],
      },
    });

    const configuration = {
      method: "post",
      url: `https://graph.facebook.com/v19.0/${config.meta.sender_phone_id}/messages`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.meta.access_token}`,
      },
      data: data,
    };
  
    console.log("data", data);
    const sendWhatsappMessage = await axios(configuration)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });

    return sendWhatsappMessage;
  }


  return booking;
};

const getAllBooking = async (options) => {
  const bookings = await Booking.paginate({}, options);
  return bookings;
};

const getBookingById = async (id) => {
  return Booking.findById(id);
};

const updateBookingById = async (bookingId, updateBody) => {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Booking not found");
  }
  Object.assign(booking, updateBody);
  await booking.save();
  return booking;
};

const deleteBookingById = async (bookingId) => {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
  }
  await booking.remove();
  return booking;
};

module.exports = {
  createBooking,
  getAllBooking,
  getBookingById,
  updateBookingById,
  deleteBookingById,
};
