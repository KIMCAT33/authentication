const express = require('express');
const router = express.Router();
const vendusterController = require('../app/api/controllers/namyangsu');

router.get('/', vendusterController.getAll);
router.post('/phone', vendusterController.getById);
router.post('/', vendusterController.create);
router.post('/update',vendusterController.updateById);


module.exports = router;