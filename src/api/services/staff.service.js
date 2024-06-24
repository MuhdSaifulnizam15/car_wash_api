const httpStatus = require("http-status");
const moment = require("moment");

const { Staff, User, Sale } = require("../models");
const ApiError = require("../utils/ApiError");
const { getBranchById } = require("./branch.service");
const { createUser, updateUserById, deleteUserById } = require("./user.service");

const createStaff = async (userBody) => {
  if (await Staff.isPhoneNumberTaken(userBody.phone_no)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "staff phone number already exist."
    );
  }
  const branch = await getBranchById(userBody.branch_id);
  if (!branch) {
    throw new ApiError(httpStatus.BAD_REQUEST, "branch not found.");
  }
  userBody.branch_id = branch._id;

  const user = await createUser(userBody);
  console.log("user", user);
  userBody.user_id = user._id;

  const staff = await Staff.create(userBody);
  return staff;
};

const queryStaffs = async (options) => {
  // console.log('options', options);
  options.populate = ["branch_id", "user_id"];
  options.sort = { createdAt: -1 };

  const staffs = await Staff.paginate({}, options);
  return staffs;
};

const getStaffById = async (id) => {
  return Staff.findById(id).populate([
    "branch_id", "user_id"
  ]);
};

const getStaffByName = async (name) => {
  return Staff.findOne({ fullname: name });
};

const getStaffByUserId = async (user_id) => {
  return Staff.findOne({ user_id });
};

const updateStaffById = async (staffId, updateBody) => {
  const staff = await getStaffById(staffId);
  if (!staff) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Staff not found");
  }
  Object.assign(staff, updateBody);
  await staff.save();
  const userBody = {
    first_name: updateBody.first_name,
    last_name: updateBody.last_name,
    user_id: staff.user_id._id,
  }
  console.log('userBody', userBody, userBody.user_id)
  await updateUserById(userBody.user_id, userBody);
  return staff;
};

const deleteStaffById = async (staffId) => {
  const staff = await getStaffById(staffId);
  if (!staff) {
    throw new ApiError(httpStatus.NOT_FOUND, "Staff not found");
  }
  await staff.remove();
  await deleteUserById(staff.user_id);
  return staff;
};

const getTotalSaleData = async (filter, options) => {
  const { startDate, endDate } = filter;
  console.log('startDate', startDate, endDate)

  const start_date = startDate ? moment(startDate).format() : moment().toDate();
  const end_date = endDate ? moment(endDate).format() : moment().toDate();

  options.populate = ['branch_id', 'user_id'];
  let staffs = await Staff.paginate({}, options);

  var totalSale = await Promise.all(
    staffs.docs.map(async (staff, index) => {
      // Get staff sales
      const sale = await Sale.aggregate([
        {
          $match: {
            barber_id: staff._id,
            // branch_id: staff.branch_id._id,
            createdAt: {
              $gte: moment(start_date).toDate(),
              $lte: moment(end_date).endOf('day').toDate(),
            },
          },
        },
        {
          $group: {
            _id: staff._id,
            totalSales: { $sum: { $toDouble: '$total' } },
          },
        },
      ]);

      staff.sale = sale[0]?.totalSales || 0;

      return {
        staff_id: staff._id,
        staff_name: staff.full_name,
        branch: staff.branch_id,
        total_sale: sale[0]?.totalSales || 0,
      };
    })
  );

  return totalSale;
};

module.exports = {
  createStaff,
  queryStaffs,
  getStaffById,
  getStaffByName,
  updateStaffById,
  deleteStaffById,
  getStaffByUserId,
  getTotalSaleData,
};
