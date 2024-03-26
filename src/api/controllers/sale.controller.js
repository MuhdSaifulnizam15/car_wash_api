const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { saleService, staffService } = require("../services");

const createSale = catchAsync(async (req, res) => {
  const sale = await saleService.createSale(req.body);
  res.status(httpStatus.CREATED).send({ status: true, code: "0000", sale });
});

const getSales = catchAsync(async (req, res) => {
  const params = pick(req.query, ["sort", "limit", "page", "userId"]);
  if (params?.userId) {
    const staff = await staffService.getStaffByUserId(params.userId);
    console.log(staff);
    req.query.barber_id = staff._id.toString();
  }
  const options = pick(req.query, [
    "sort",
    "limit",
    "page",
    "barber_id",
    "branch_id",
    "customer_id",
  ]);
  const result = await saleService.querySales(options);
  res.send({ status: true, code: "0000", result });
});

const getSale = catchAsync(async (req, res) => {
  const sale = await saleService.getServiceById(req.params.saleId);
  if (!sale) {
    throw new ApiError(httpStatus.NOT_FOUND, "Sale not found");
  }
  res.send({ status: true, code: "0000", sale });
});

const updateSale = catchAsync(async (req, res) => {
  const sale = await saleService.updateServiceById(req.params.saleId, req.body);
  res.send({ status: true, code: "0000", sale });
});

const deleteSale = catchAsync(async (req, res) => {
  await saleService.deleteSaleById(req.params.saleId);
  res.send({
    status: true,
    code: "0000",
    message: "Sale successfully deleted",
  });
});

const getTotalSales = catchAsync(async (req, res) => {
  const data = await saleService.getTotalSales();
  res.send({ status: true, code: "0000", sales_data: data });
});

const getChartData = catchAsync(async (req, res) => {
  const data = await saleService.getChartData(req.params.chartType);
  res.send({ status: true, code: "0000", chart: data });
});

module.exports = {
  createSale,
  getSale,
  getSales,
  updateSale,
  deleteSale,
  getTotalSales,
  getChartData,
};
