const express = require('express');
const controller = require('../controllers/adminform');
const router = express.Router();

router.post('/admin/register', controller.adminRegistration);
router.post('/admin/login', controller.adminLogin);

module.exports = router;
