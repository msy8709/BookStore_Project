const express = require("express");
const router = express.Router();
const {order, getOrders, getOrderDetail} = require('../controller.js/OrderController');
router.use(express.json()); //json 형식으로 들어올 것이다. 
//주문하기
router.post('/', order);
//주문 목록 조회
router.get('/' , getOrders);
//주문 상세 상품 조회
router.get('/:id' , getOrderDetail);



module.exports = router;