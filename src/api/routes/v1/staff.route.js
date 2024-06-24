const express = require('express');
const { staffController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { staffValidation } = require('../../validations');

const router = express.Router();

router.post('/', auth('manageStaff'), validate(staffValidation.createStaff), staffController.createStaff);
router.get('/', auth('getStaffs'), validate(staffValidation.getStaffs), staffController.getStaffs);
router.get('/sales', auth('getStaffs'), validate(staffValidation.getTotalSaleData), staffController.getTotalSaleData);
router.get('/:staffId', auth('getStaff'), validate(staffValidation.getStaff), staffController.getStaff);
router.post('/update/:staffId', auth('manageStaff'), validate(staffValidation.updateStaff), staffController.updateStaff);
router.post('/delete/:staffId', auth('manageStaff'), validate(staffValidation.deleteStaff), staffController.deleteStaff);

module.exports = router;