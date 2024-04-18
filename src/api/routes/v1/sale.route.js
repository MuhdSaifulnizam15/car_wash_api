const express = require('express');
const { saleController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { saleValidation } = require('../../validations');

const router = express.Router();

router.post('/', auth('manageSale'), validate(saleValidation.createSale), saleController.createSale);
router.get('/', auth('getSales'), validate(saleValidation.getSales), saleController.getSales);
router.get('/:saleId', auth('getSale'), validate(saleValidation.getSale), saleController.getSale);
router.get('/data/total-sales', auth('getSale'), validate(saleValidation.getTotalSales), saleController.getTotalSales);
router.get('/chart/:chartType', auth('getSale'), validate(saleValidation.getChartData), saleController.getChartData);
router.post('/update/:saleId', auth('manageSale'), validate(saleValidation.updateSale), saleController.updateSale);
router.post('/delete/:saleId', auth('manageSale'), validate(saleValidation.deleteSale), saleController.deleteSale);
router.get('/report/:type', auth('getSale'), saleController.getSalesReport);

module.exports = router;