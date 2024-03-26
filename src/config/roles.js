const roles = ["staff", "admin"];

const roleRights = new Map();

const getPermissionList = [
  "getUser",
  "getUsers",
  "getDashboard",
  "getUserProfile",
  "getCategory",
  "getCategories",
  "getService",
  "getServices",
  "getBranch",
  "getBranches",
  "getStaff",
  "getStaffs",
  "getCustomer",
  "getCustomers",
  "getSale",
  "getSales",
];
const staffPermissionList = ["manageSale"];
const adminManagePermissionList = [
  "manageUsers",
  "manageCategory",
  "manageService",
  "manageBranch",
  "manageStaff",
  "manageCustomer",
  "manageSale",
];

roleRights.set(roles[0], staffPermissionList.concat(getPermissionList));
roleRights.set(
  roles[1],
  adminManagePermissionList.concat(getPermissionList, staffPermissionList)
);

module.exports = {
  roles,
  roleRights,
};
