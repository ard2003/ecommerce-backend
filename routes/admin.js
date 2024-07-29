const express = require('express');
const controller = require('../controllers/adminform');
const router = express.Router();
const {uploadFile} =require('../middleware/fileuploding')


router.post('/admin/register', controller.adminRegistration);
router.post('/admin/login', controller.adminLogin);
router.post('/admin/productupload',uploadFile,controller.addproduct)
router.put('/admin/updateProduct/:id',uploadFile,controller.updateProduct)
router.delete('admin/deleteproduct/:id',controller.deleteProduct)
module.exports = router;
