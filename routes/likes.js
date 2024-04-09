const express = require("express");
const router = express.Router();

router.use(express.json()); //json 형식으로 들어올 것이다. 
//좋아요 추가
router.post('/:id', (req, res) => {
    res.json('좋아요 추가')
});
//좋아요 삭제
router.post('/:id' , (req, res) => {
    res.json('좋아요 삭제')
});


module.exports = router;