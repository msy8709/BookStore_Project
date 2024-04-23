const express = require("express");
const { allCategory} = require('../controller.js/CategoryController');
const router = express.Router();

router.use(express.json()); //json 형식으로 들어올 것이다. 


//전체 도서 조회
router.get('/', allCategory); // (카테고리별)전체 도서 조회

module.exports = router;