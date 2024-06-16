const httpStatus = require("http-status");
const moment = require("moment");
const axios = require("axios");
const config = require("../../config/config");
const { Sale } = require("../models");
const ApiError = require("../utils/ApiError");
const { getBranchById } = require("./branch.service");
const {
  getCustomerById,
  updateCustomerPoints,
  createCustomer,
} = require("./customer.service");
const { getStaffById, getTotalSaleData } = require("./staff.service");
const { getBookingByCarPlate, updateBookingById } = require("./booking.service");

const createSale = async (userBody) => {
  const branch = await getBranchById(userBody.branch_id);
  if (!branch) {
    throw new ApiError(httpStatus.BAD_REQUEST, "branch not found.");
  }
  userBody.branch_id = branch._id;

  const barber = await getStaffById(userBody.barber_id);
  if (!barber) {
    throw new ApiError(httpStatus.BAD_REQUEST, "barber not found.");
  }
  userBody.barber_id = barber._id;

  let customer;
  if (userBody?.customer_id) {
    // existing customer
    customer = await getCustomerById(userBody.customer_id);
    if (!customer) {
      throw new ApiError(httpStatus.BAD_REQUEST, "customer not found.");
    }
    userBody.customer_id = customer._id;
    userBody.customer_phone_no = customer.phone_no;
  } else {
    // add new customer
    const body = {
      name: userBody?.customer_name,
      phone_no: userBody?.customer_phone_no,
    };
    customer = await createCustomer(body);
    if (!customer) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "error on saving customer data, please try again."
      );
    }
    userBody.customer_id = customer._id;
  }

  if (userBody?.total_redeemed_point) {
    if (parseFloat(userBody?.total_redeemed_point) > parseFloat(customer?.total_membership_point))
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Redeemed point more than total points, please try again"
      );
  }

  // Check whether need code for online order pickup
  const _isCodeRequired = await getBookingByCarPlate(userBody.car_plate, userBody.customer_phone_no)
  
  if(_isCodeRequired && _isCodeRequired?.code !== userBody.customer_code) {
    if(!userBody.customer_code)  
      throw new ApiError(httpStatus.BAD_REQUEST, `Code security is required`);
    else
      throw new ApiError(httpStatus.BAD_REQUEST, `Invalid code. Code sent to this phone_num, ${_isCodeRequired.phone_no}`);
  }

  const sale = await Sale.create(userBody);

  // update customer total_redeemed_point and total_spend
  const updateCustPointsBody = {
    total_redeemed_point: userBody?.total_redeemed_point || 0,
    total_rewarded_point: userBody.total_rewarded_point,
    total_spend: userBody.total,
  };

  const updateCustPointsBodyRes = await updateCustomerPoints(
    userBody.customer_id,
    updateCustPointsBody
  );

  // console.log(
  //   "updateCustPointsBodyRes",
  //   updateCustPointsBodyRes.total_membership_point
  // );
  // console.log("sale", sale);

  // update booking status
  const updateCustBookingBody = {
    status: 'completed'
  };

  const updateCustBookingBodyRes = await updateBookingById(
    _isCodeRequired._id,
    updateCustBookingBody
  );

  // send whatsapp to phone number
  const data = JSON.stringify({
    messaging_product: "whatsapp",
    to: "6" + updateCustPointsBodyRes.phone_no,
    type: "template",
    template: {
      name: "program_kesetiaan",
      language: {
        code: "ms",
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: customer.name,
            },
            {
              type: "text",
              text: branch.name,
            },
            {
              type: "text",
              text: userBody.total,
            },
            {
              type: "text",
              text: userBody.total_rewarded_point,
            },
            {
              type: "text",
              text: moment().format("Do MMM YYYY"),
            },
            {
              type: "text",
              text: updateCustPointsBodyRes.total_membership_point,
            },
          ],
        },
      ],
    },
  });

  const configuration = {
    method: "post",
    url: `https://graph.facebook.com/v15.0/${config.meta.sender_phone_id}/messages`,
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

  return sale;
};

const querySales = async (options) => {
  options.populate = ["branch_id", "barber_id", "customer_id", "order.service"];
  // console.log('options', options)
  const sales = await Sale.paginate({}, options);
  return sales;
};

const getSaleById = async (id) => {
  return Sale.findById(id).populate([
    "branch_id", "barber_id", "customer_id", "order.service"
  ]);
};

const updateSaleById = async (saleId, updateBody) => {
  const sale = await getSaleById(saleId);
  if (!sale) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Sale not found");
  }
  Object.assign(sale, updateBody);
  await sale.save();
  return sale;
};

const deleteSaleById = async (saleId) => {
  const sale = await getSaleById(saleId);
  if (!sale) {
    throw new ApiError(httpStatus.NOT_FOUND, "Sale not found");
  }
  await sale.remove();
  return sale;
};

const getChartData = async (chartType) => {
  let label = [],
    data = [],
    newData = [];
  switch (chartType) {
    case "daily":
      label = [
        moment().format("DD MMM YY"),
        moment().subtract(1, "day").format("DD MMM YY"),
        moment().subtract(2, "day").format("DD MMM YY"),
        moment().subtract(3, "day").format("DD MMM YY"),
        moment().subtract(4, "day").format("DD MMM YY"),
        moment().subtract(5, "day").format("DD MMM YY"),
      ].reverse();

      console.log(
        'moment().subtract(5, "day").toISOString()',
        moment().subtract(5, "day").toDate(),
        new Date()
      );

      data = await Sale.aggregate([
        {
          $match: {
            createdAt: {
              $gte: moment().subtract(5, "day").toDate(),
              $lte: moment().toDate(),
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            totalSales: { $sum: { $toDouble: "$total" } },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // populate data based on label
      newData = label.map((item) => {
        const found = data.find(
          (e) => e._id === moment(item).format("YYYY-MM-DD")
        );

        if (found) {
          return found.totalSales.toFixed(2);
        } else {
          return 0;
        }
      });

      console.log("data", data);
      console.log("newData", newData);

      return {
        label,
        data: newData,
      };
      break;

    case "week":
      label = [
        moment().startOf("week").format("DD MMM YY"),
        moment().subtract(1, "weeks").startOf("week").format("DD MMM YY"),
        moment().subtract(2, "weeks").startOf("week").format("DD MMM YY"),
        moment().subtract(3, "weeks").startOf("week").format("DD MMM YY"),
        moment().subtract(4, "weeks").startOf("week").format("DD MMM YY"),
        moment().subtract(5, "weeks").startOf("week").format("DD MMM YY"),
      ].reverse();

      data = await Sale.aggregate([
        {
          $project: {
            week: { $week: "$createdAt" },
            year: { $year: "$createdAt" },
            total: 1,
            createdAt: 1,
          },
        },
        {
          $match: {
            createdAt: {
              $gte: moment().subtract(10, "weeks").startOf("week").toDate(),
              $lte: moment().toDate(),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              week: { $week: "$createdAt" },
            },
            totalSales: { $sum: { $toDouble: "$total" } },
          },
        },
      ]);
      console.log("data", data);

      // populate data based on label
      newData = label.map((item) => {
        const found = data.find(
          (e) =>
            e._id.week === moment(item).week() &&
            e._id.year == moment(item).format("YYYY")
        );

        if (found) {
          return found.totalSales.toFixed(2);
        } else {
          return 0;
        }
      });

      console.log("newData", newData);

      return {
        data: newData,
        label,
      };
      break;

    case "month":
      label = [
        moment().startOf("month").format("MMM YYYY"),
        moment().subtract(1, "month").startOf("month").format("MMM YYYY"),
        moment().subtract(2, "month").startOf("month").format("MMM YYYY"),
        moment().subtract(3, "month").startOf("month").format("MMM YYYY"),
        moment().subtract(4, "month").startOf("month").format("MMM YYYY"),
        moment().subtract(5, "month").startOf("month").format("MMM YYYY"),
      ].reverse();

      // data = [30500, 29800, 25050, 31790, 32456, 34789];

      data = await Sale.aggregate([
        {
          $project: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            total: 1,
            createdAt: 1,
          },
        },
        {
          $match: {
            createdAt: {
              $gte: moment().subtract(5, "month").startOf("month").toDate(),
              $lte: moment().toDate(),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            totalSales: { $sum: { $toDouble: "$total" } },
          },
        },
      ]);

      // populate data based on label
      newData = label.map((item) => {
        const found = data.find(
          (e) =>
            e._id.year == moment(item).format("YYYY") &&
            e._id.month == moment(item).format("M")
        );

        if (found) {
          return found.totalSales.toFixed(2);
        } else {
          return 0;
        }
      });

      console.log("data", data);
      console.log("newData", newData);

      return {
        data: newData,
        label,
      };
      break;

    case "annual":
      label = [
        moment().startOf("year").format("YYYY"),
        moment().subtract(1, "year").startOf("year").format("YYYY"),
        moment().subtract(2, "year").startOf("year").format("YYYY"),
      ].reverse();

      data = await Sale.aggregate([
        {
          $project: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            total: 1,
            createdAt: 1,
          },
        },
        {
          $match: {
            createdAt: {
              $gte: moment().subtract(2, "year").startOf("year").toDate(),
              $lte: moment().toDate(),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            totalSales: { $sum: { $toDouble: "$total" } },
          },
        },
      ]);

      // populate data based on label
      newData = label.map((item) => {
        const found = data.find(
          (e) => e._id.year == moment(item).format("YYYY")
        );

        if (found) {
          return found.totalSales.toFixed(2);
        } else {
          return 0;
        }
      });

      console.log("data", data);
      console.log("newData", newData);

      return {
        data: newData,
        label,
      };
      break;
  }
};

const getTotalSales = async () => {
  let today = 0,
    past_3_day = 0,
    last_week = 0,
    last_month = 0;

  // total sales today
  const salesToday = await Sale.find({
    createdAt: {
      $gte: moment().startOf("day"),
      $lt: moment().endOf("day"),
    },
  });

  today = salesToday.reduce((a, b) => +a + +b.total, 0);

  // total sales for past 3 day
  const salesPast3Day = await Sale.find({
    createdAt: {
      $gte: moment().subtract(3, "day").startOf("day"),
      $lt: moment().endOf("day"),
    },
  });

  past_3_day = salesPast3Day.reduce((a, b) => +a + +b.total, 0);

  // total sales for last week
  const salesLastWeek = await Sale.find({
    createdAt: {
      $gte: moment().subtract(1, "weeks").startOf("week"),
      $lt: moment().subtract(1, "weeks").endOf("week"),
    },
  });

  last_week = salesLastWeek.reduce((a, b) => +a + +b.total, 0);

  // total sales today
  const salesLastMonth = await Sale.find({
    createdAt: {
      $gte: moment().subtract(1, "month").startOf("month"),
      $lt: moment().subtract(1, "month").endOf("month"),
    },
  });

  last_month = salesLastMonth.reduce((a, b) => +a + +b.total, 0);

  return {
    today,
    past_3_day,
    last_week,
    last_month,
  };
};

const getSalesReport = async (filter) => {
  const { type, date, branch_id } = filter;
  let start_date = moment(date).format(),
    end_date = moment(date).format(),
    sales_data = [];

  if(type == 'annual'){
    start_date = moment(date).startOf('year').toDate();
    end_date = moment(date).endOf('year').toDate();
  } else if (type === 'month'){
    start_date = moment(date).startOf('month').toDate();
    end_date = moment(date).endOf('month').toDate();
  }

  // console.log('start_date', start_date)
  // console.log('end_date', end_date)

  if(branch_id) {
    sales_data = await Sale.find({
      createdAt: {
        $gte: start_date,
        $lte: end_date,
      },
      branch_id: branch_id
    }).populate(['branch_id', 'barber_id', 'customer_id', 'order.service']);
  } else {
    sales_data = await Sale.find({
      createdAt: {
        $gte: start_date,
        $lte: end_date,
      },
    }).populate(['branch_id', 'barber_id', 'customer_id', 'order.service']);
  }

  let statsFilter = filter, statsOptions = [];
  filter.startDate = start_date;
  filter.endDate = end_date;

  const staff_stats = await getTotalSaleData(statsFilter, statsOptions);
  // console.log('staff_stats', staff_stats);

  return {
    sales_data,
    staff_stats,
  };
};

module.exports = {
  createSale,
  querySales,
  getSaleById,
  updateSaleById,
  deleteSaleById,
  getTotalSales,
  getChartData,
  getSalesReport,
};
