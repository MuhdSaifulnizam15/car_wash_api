const express = require("express");
const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const categoryRoutes = require("./category.route");
const serviceRoutes = require("./service.route");
const branchRoutes = require("./branch.route");
const staffRoutes = require("./staff.route");
const customerRoutes = require("./customer.route");
const saleRoutes = require("./sale.route");
const bookingRoutes = require("./booking.route");

const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/categories",
    route: categoryRoutes,
  },
  {
    path: "/services",
    route: serviceRoutes,
  },
  {
    path: "/branches",
    route: branchRoutes,
  },
  {
    path: "/staff",
    route: staffRoutes,
  },
  {
    path: "/customer",
    route: customerRoutes,
  },
  {
    path: "/sales",
    route: saleRoutes,
  },
  {
    path: "/booking",
    route: bookingRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
