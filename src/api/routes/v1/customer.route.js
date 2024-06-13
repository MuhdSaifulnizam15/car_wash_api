const express = require('express');
const { customerController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { customerValidation } = require('../../validations');

const router = express.Router();

router.post('/', auth('manageCustomer'), validate(customerValidation.createCustomer), customerController.createCustomer);
router.get('/', auth('getCustomers'), validate(customerValidation.getCustomers), customerController.getCustomers);
router.get('/:customerId', auth('getCustomer'), validate(customerValidation.getCustomer), customerController.getCustomer);
router.get('/check/phone/:phoneNo', validate(customerValidation.getCustomerByPhoneNum), customerController.getCustomerByPhoneNum);
router.post('/update/:customerId', auth('manageCustomer'), validate(customerValidation.updateCustomer), customerController.updateCustomer);
router.post('/delete/:customerId', auth('manageCustomer'), validate(customerValidation.deleteCustomer), customerController.deleteCustomer);

module.exports = router;