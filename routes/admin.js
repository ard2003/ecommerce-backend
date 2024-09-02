const express = require('express');
const controller = require('../controllers/adminform');
const router = express.Router();
const {uploadFile} =require('../middleware/fileuploding')
const veryfyToken=require('../middleware/adminAuth')


router.post('/admin/register',controller.adminRegistration);
router.post('/admin/login', controller.adminLogin);
router.post('/admin/products/add',veryfyToken,uploadFile,controller.addproduct)
router.put('/admin/Products/update/:id',veryfyToken,uploadFile,controller.updateProduct)
router.delete('/admin/products/delete/:id',veryfyToken, controller.deleteProduct)
router.get('/admin/users',veryfyToken,controller.viewUsers)
router.get('/admin/user/:id',veryfyToken, controller.viewUser)
router.get('/admin/products',veryfyToken, controller.viewProducts)
router.get('/admin/product/:id',veryfyToken, controller.viewProduct)
router.get('/admin/product/bycatagory/:id',veryfyToken, controller.productByCatagory)
router.get('/admin/usercart/:id',veryfyToken, controller.getcart)
router.get('/admin/order/:userId',veryfyToken, controller.order)
router.get('/admin/orders',veryfyToken, controller.orders)
router.get('/admin/revanue',veryfyToken, controller.totalRevenue)









module.exports = router;
