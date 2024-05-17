const httpStatus = require("http-status");
const moment = require("moment");
const { Service, Sale } = require("../models");
const ApiError = require("../utils/ApiError");
const { getCategoryById } = require("./category.service");

const createService = async (userBody) => {
  if (await Service.isNameTaken(userBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "service already exist.");
  }
  const category = await getCategoryById(userBody.category_id);
  if (!category) {
    throw new ApiError(httpStatus.BAD_REQUEST, "category not found.");
  }
  userBody.category_id = category._id;
  const service = await Service.create(userBody);
  return service;
};

const queryServices = async (options) => {
  options.populate = ["category_id"];
  const services = await Service.paginate({}, options);
  return services;
};

const getServiceById = async (id) => {
  return Service.findById(id).populate({
    path: "category_id",
  });;
};

const getServiceByName = async (name) => {
  return Service.findOne({ name });
};

const updateServiceById = async (serviceId, updateBody) => {
  const service = await getServiceById(serviceId);
  if (!service) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Service not found");
  }
  Object.assign(service, updateBody);
  await service.save();
  return service;
};

const deleteServiceById = async (serviceId) => {
  const service = await getServiceById(serviceId);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service not found");
  }
  await service.remove();
  return service;
};

const getChartData = async (options) => {
  const { startDate, endDate } = options;
  let label = [],
    newLabel = [],
    data = [],
    newData = [];

  const start_date = startDate ? moment(startDate).format() : moment().toDate();
  const end_date = endDate ? moment(endDate).format() : moment().toDate();

  label = await Service.find({});

  data = await Sale.aggregate([
    {
      $match: {
        createdAt: {
          $gte: moment(start_date).toDate(),
          $lte: moment(end_date).endOf("day").toDate(),
        },
      },
    },
    {
      $unwind: "$order",
    },
    {
      $lookup: {
        from: "services",
        localField: "order.service",
        foreignField: "_id",
        as: "order.service",
      },
    },
    {
      $group: {
        _id: "$order.service.name",
        quantity: { $sum: { $toDouble: "$order.quantity" } },
        id: { $first: "$order.service._id" },
        price: { $first: "$order.service.price" },
      },
    },
  ]);

  // populate data based on label
  newLabel = label.map((obj) => {
    return obj.name;
  });

  newData = label.map((item) => {
    // console.log('item', item);
    const found = data.find((e) => e._id[0] === item.name);

    // console.log('found', found)

    if (found) {
      return found.quantity * found.price[0];
    } else {
      return 0;
    }
  });

  // console.log("data", data);
  // console.log("newData", newData);

  return {
    label: newLabel,
    data: newData,
  };
};

module.exports = {
  createService,
  queryServices,
  getServiceById,
  getServiceByName,
  updateServiceById,
  deleteServiceById,
  getChartData,
};
