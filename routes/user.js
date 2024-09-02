const express = require('express');
const controller = require('../controllers/userform');
const router = express.Router();
const userAuth = require('../middleware/userAuth')

router.post('/user/registration',controller.userRegistration)
router.post('/user/login',controller.userLogin)
router.get('/user/products',controller.viewProducts)
router.get('/user/product',controller.viewProduct)
router.get('/user/product/:id',controller.productByCatagory)
router.post('/user/add/cart',userAuth,controller.addToCart)
router.get('/user/view/cart',userAuth,controller.getCart)
router.put('/user/cart/increase/:productId',controller.incrementQuantity)
router.put('/user/cart/decrease/:productId',controller.dcrimentQuantity)
router.delete('/user/cart/delete/:productId',controller.deleteItems)
router.post('/user/order',userAuth,controller.order)
router.post('/user/order/success',userAuth,controller.orderSucces)
router.get('/user/orders',userAuth,controller.orders)












module.exports=router