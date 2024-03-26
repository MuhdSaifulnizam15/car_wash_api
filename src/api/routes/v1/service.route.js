const express = require('express');
const { serviceController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { serviceValidation } = require('../../validations');

const router = express.Router();

router.post('/', auth('manageService'), validate(serviceValidation.createService), serviceController.createService);
router.get('/', auth('getServices'), validate(serviceValidation.getServices), serviceController.getServices);
router.get('/:serviceId', auth('getService'), validate(serviceValidation.getService), serviceController.getService);
router.get('/chart/data', auth('getServices'), validate(serviceValidation.getServices), serviceController.getChartData);
router.post('/update/:serviceId', auth('manageService'), validate(serviceValidation.updateService), serviceController.updateService);
router.post('/delete/:serviceId', auth('manageService'), validate(serviceValidation.deleteService), serviceController.deleteService);

module.exports = router;