const express = require("express");
const { allBooks, BookDetail} = require('../controller.js/BookController');
const router = express.Router();

router.use(express.json()); //json 형식으로 들어올 것이다. 


//전체 도서 조회
router.get('/', allBooks); // (카테고리별)전체 도서 조회
//개별 도서 조회
router.get('/:id' , BookDetail);



module.exports = router;