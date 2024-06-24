const httpStatus = require('http-status');
const moment = require('moment');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { staffService } = require('../services');

const createStaff = catchAsync(async (req, res) => {
    const staff = await staffService.createStaff(req.body);
    res.status(httpStatus.CREATED).send({ status: true, code: '0000', staff });
});

const getStaffs = catchAsync(async (req, res) => {
    const options = pick(req.query, ['sort', 'limit', 'page', 'branch_id', 'user_id']);
    const result = await staffService.queryStaffs(options);
    res.send({ status: true, code: '0000', result });
});

const getStaff = catchAsync(async (req, res) => {
    const staff = await staffService.getStaffById(req.params.staffId);
    if(!staff){
        throw new ApiError(httpStatus.NOT_FOUND, 'Staff not found');
    }
    res.send({ status: true, code: '0000', staff });
});

const updateStaff = catchAsync(async (req, res) => {
    const staff = await staffService.updateStaffById(req.params.staffId, req.body);
    res.send({ status: true, code: '0000', staff });
});

const deleteStaff = catchAsync(async (req, res) => {
    await staffService.deleteStaffById(req.params.staffId);
    res.send({ status: true, code: '0000', message: 'Staff successfully deleted'});
});

const getTotalSaleData = catchAsync(async (req, res) => {
    const filter = pick(req.query, [
      'full_name',
      'phone_no',
      'branch_id',
      'user_id',
      'startDate',
      'endDate',
    ]);
  
    if (req?.query?.start_date) {
      filter.createdAt = {
        $gte: moment(req?.query?.start_date).startOf('day').format(),
        $lte: req?.query?.end_date
          ? moment(req?.query?.end_date).endOf('day').format()
          : moment().endOf('day').format(),
      };
    }
  
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
  
    const result = await staffService.getTotalSaleData(filter, options);
    res.send({ status: true, code: '0000', result });
  });

module.exports = {
    createStaff,
    getStaff,
    getStaffs,
    updateStaff,
    deleteStaff,
    getTotalSaleData,
};