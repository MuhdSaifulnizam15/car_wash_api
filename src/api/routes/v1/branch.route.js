const express = require('express');
const { branchController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { branchValidation } = require('../../validations');

const router = express.Router();

router.post('/', auth('manageBranch'), validate(branchValidation.createBranch), branchController.createBranch);
router.get('/', validate(branchValidation.getBranches), branchController.getBranches);
router.get('/:branchId', validate(branchValidation.getBranch), branchController.getBranch);
router.post('/update/:branchId', auth('manageBranch'), validate(branchValidation.updateBranch), branchController.updateBranch);
router.post('/delete/:branchId', auth('manageBranch'), validate(branchValidation.deleteBranch), branchController.deleteBranch);

module.exports = router;