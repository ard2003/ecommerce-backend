const express = require('express');
const controller = require('../controllers/adminform');
const router = express.Router();
const {uploadFile} =require('../middleware/fileuploding')
const veryfyToken=require('../middleware/adminAuth')


router.post('/admin/register',controller.adminRegistration);
router.post('/admin/login', controller.adminLogin);
router.post('/admin/productupload',uploadFile,controller.addproduct)
router.put('/admin/updateProduct/:id',uploadFile,controller.updateProduct)
router.delete('/admin/deleteproduct/:id', controller.deleteProduct)
router.get('/admin/users', controller.viewUsers)
router.get('/admin/user/:id', controller.viewUser)
router.get('/admin/products', controller.viewProducts)
router.get('/admin/product/:id', controller.viewProduct)
router.get('/admin/productbycatagory/:id', controller.productByCatagory)
router.get('/admin/usercart/:id', controller.getcart)
router.get('/admin/order/:userId', controller.order)
router.get('/admin/orders', controller.orders)
router.get('/admin/revanue', controller.totalRevenue)









module.exports = router;
