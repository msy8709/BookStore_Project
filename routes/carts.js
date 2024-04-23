const express = require("express");
const router = express.Router();
const {addToCart, getCartItems, removeCartItem} = require('../controller.js/CartController');

router.use(express.json()); //json 형식으로 들어올 것이다. 
//장바구니 담기
router.post('/', addToCart);
//장바구니 조회
router.get('/' , getCartItems); //장바구니 아이템 목록 조회 / 선택된 장바구니 아이템 목록 조회
//장바구니 도서 삭제
router.delete('/:id' , removeCartItem);



module.exports = router;