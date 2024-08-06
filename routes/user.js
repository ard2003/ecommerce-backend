const express = require('express');
const controller = require('../controllers/userform');
const router = express.Router();

router.post('/user/registration',controller.userRegistration)
router.post('/user/login',controller.userLogin)
router.get('/user/products',controller.viewProducts)
router.get('/user/product',controller.viewProduct)
router.get('/user/product/bycatagory/:id',controller.productByCatagory)




module.exports=router