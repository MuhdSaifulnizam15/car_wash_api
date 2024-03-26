const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { serviceService } = require("../services");

const createService = catchAsync(async (req, res) => {
  const service = await serviceService.createService(req.body);
  res.status(httpStatus.CREATED).send({ status: true, code: "0000", service });
});

const getServices = catchAsync(async (req, res) => {
  const options = pick(req.query, ["sort", "limit", "page"]);
  const result = await serviceService.queryServices(options);
  res.send({ status: true, code: "0000", result });
});

const getService = catchAsync(async (req, res) => {
  const service = await serviceService.getServiceById(req.params.serviceId);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service not found");
  }
  res.send({ status: true, code: "0000", service });
});

const updateService = catchAsync(async (req, res) => {
  const service = await serviceService.updateServiceById(
    req.params.serviceId,
    req.body
  );
  res.send({ status: true, code: "0000", service });
});

const deleteService = catchAsync(async (req, res) => {
  await serviceService.deleteServiceById(req.params.serviceId);
  res.send({
    status: true,
    code: "0000",
    message: "Service successfully deleted",
  });
});

const getChartData = catchAsync(async (req, res) => {
  const options = pick(req.query, ["startDate", "endDate"]);
  const data = await serviceService.getChartData(options);
  res.send({ status: true, code: "0000", chart: data});
});

module.exports = {
  createService,
  getService,
  getServices,
  updateService,
  deleteService,
  getChartData,
};
