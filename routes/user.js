const express = require('express');
const controller = require('../controllers/userform');
const router = express.Router();

router.post('/user/registration',controller.userRegistration)
router.post('/user/login',controller.userLogin)
router.get('/user/products',controller.viewProducts)
router.get('/user/product',controller.viewProduct)
router.get('/user/product/bycatagory/:id',controller.productByCatagory)
router.post('/user/add/cart',controller.addToCart)
router.get('/user/view/cart',controller.getCart)
router.put('/user/cart/item/increment',controller.incrementQuantity)
router.put('/user/cart/item/decrement',controller.dcrimentQuantity)
router.delete('/user/cart/item/delete',controller.deleteItems)









module.exports=router