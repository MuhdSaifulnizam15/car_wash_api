const httpStatus = require("http-status");
const { Customer } = require("../models");
const ApiError = require("../utils/ApiError");

const createCustomer = async (userBody) => {
  if (await Customer.isPhoneNumberTaken(userBody.phone_no)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "customer phone number already exist.");
  }
  const customer = await Customer.create(userBody);
  return customer;
};

const queryCustomers = async (options) => {
  const customers = await Customer.paginate({}, options);
  return customers;
};

const getCustomerById = async (id) => {
  return Customer.findById(id);
};

const getCustomerByName = async (name) => {
  return Customer.findOne({ name });
};

const getCustomerByPhoneNum = async (phone_no) => {
  return Customer.findOne({ phone_no })
}

const updateCustomerById = async (customerId, updateBody) => {
  const customer = await getCustomerById(customerId);
  if (!customer) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Customer not found");
  }
  Object.assign(customer, updateBody);
  await customer.save();
  return customer;
};

const updateCustomerPoints = async (customerId, updateBody) => {
  const customer = await getCustomerById(customerId);
  if (!customer) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Customer not found");
  }

  customer.total_spend = parseFloat(parseFloat(customer.total_spend) + parseFloat(updateBody.total_spend ?? 0)).toFixed(2);
  customer.total_membership_point = parseFloat(parseFloat(customer.total_membership_point) + parseFloat(updateBody.total_rewarded_point ?? 0) - parseFloat(updateBody.total_redeemed_point)).toFixed(0);
  customer.total_redeemed_point = parseFloat(parseFloat(customer.total_redeemed_point) + parseFloat(updateBody.total_redeemed_point ?? 0)).toFixed(0)

  await customer.save();
  return customer;
}

const deleteCustomerById = async (customerId) => {
  const customer = await getCustomerById(customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, "Customer not found");
  }
  await customer.remove();
  return customer;
};

module.exports = {
  createCustomer,
  queryCustomers,
  getCustomerById,
  getCustomerByName,
  updateCustomerById,
  deleteCustomerById,
  updateCustomerPoints,
  getCustomerByPhoneNum,
};
