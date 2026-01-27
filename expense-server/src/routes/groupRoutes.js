const express = require('express');
const authController = require('../controllers/groupController');

const router = express.Router();

router.post('/create', groupController.create);

module.exports = router;