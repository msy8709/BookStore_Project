
const express = require("express");
const router = express.Router();
const conn = require('../mariadb');

const {join,login,PasswordResetRequest,PasswordReset} = require("../controller.js/UserController");

router.use(express.json()); //json 형식으로 들어올 것이다. 
//회원가입
router.post('/join', join);
//로그인
router.post('/login', login);
//비밀번호 초기화 요청
router.post('/reset', PasswordResetRequest);
//비밀번호 초기화
router.put('/reset', PasswordReset);

module.exports = router;