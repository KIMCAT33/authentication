const express = require('express');
const router = express.Router();
const vendusterController = require('../app/api/controllers/venduster');

router.get('/', vendusterController.getAll);
router.get('/:phone', vendusterController.getById);
router.post('/', vendusterController.create);
router.patch('/',vendusterController.updateById);


module.exports = router;