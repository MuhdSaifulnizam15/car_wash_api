const httpStatus = require("http-status");
const { Branch, Address } = require("../models");
const ApiError = require("../utils/ApiError");

const createBranch = async (userBody) => {
  if (await Branch.isNameTaken(userBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Branch already exist.");
  }
  const address = await Address.create(userBody.address);
  const branchUserBody = {};
  branchUserBody.name = userBody.name;
  branchUserBody.address = address._id;
  const branch = await Branch.create(branchUserBody);
  return branch;
};

const getAllBranch = async (options) => {
  options.populate = {
    path: "address",
  };
  const branchs = await Branch.paginate({}, options);
  return branchs;
};

const getBranchById = async (id) => {
  return Branch.findById(id).populate({
    path: "address",
  });
};

const updateBranchById = async (branchId, updateBody) => {
  const branch = await getBranchById(branchId);
  if (!branch) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Branch not found");
  }
  Object.assign(branch, updateBody);
  await branch.save();
  return branch;
};

const deleteBranchById = async (branchId) => {
  const branch = await getBranchById(branchId);
  if (!branch) {
    throw new ApiError(httpStatus.NOT_FOUND, "Branch not found");
  }
  await branch.remove();
  return branch;
};

module.exports = {
  createBranch,
  getAllBranch,
  getBranchById,
  updateBranchById,
  deleteBranchById,
};
