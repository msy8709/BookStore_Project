const express = require("express");
const { removeLike, addLike } = require("../controller.js/LikeController");
const router = express.Router();

router.use(express.json()); //json 형식으로 들어올 것이다. 
//좋아요 추가
router.post('/:id', addLike);
//좋아요 삭제
router.delete('/:id' , removeLike);


module.exports = router;