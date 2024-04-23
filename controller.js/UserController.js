const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto'); //암호화 담당 모듈
dotenv.config();

const join = (req, res) => {
    const {email, password} = req.body;

    //회원가입 시 비밀번호를 암호화해서 암호화된 비밀번호와, salt 값을 같이 저장
    //로그인 시 이메일과 비밀번호(날 것) => salt값 꺼내서 비밀번호 암호화 해보고 => 디ㅣㅂ 비밀번호랑 비교
    let sql = 'INSERT INTO users (email, password, salt) VALUES (?,?,?)';
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000,10,'sha512').toString('base64');

    let values = [email, hashPassword, salt];

    conn.query(sql, values,
        (err,results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            console.log(results.password)
            return res.status(StatusCodes.CREATED).json(results)
        }
    )
};

const login = (req, res) =>{
    const {email,password} = req.body;
    let sql = 'SELECT * FROM users WHERE email = ?';

    conn.query(sql, email,
        (err,results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const loginUser = results[0];

            //salt값 꺼내서 날 것으로 들어온 비밀번호를 암호화 해보고
            const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000,10,'sha512').toString('base64');
            //db 비밀번호 비교
            if(loginUser && loginUser.password == hashPassword){
                const token = jwt.sign({
                    id : loginUser.id,
                    email : loginUser.email
                }, process.env.PRIVATE_KEY,{
                    expiresIn : '5m',
                    issuer : "soyeong"
                })

                //token 쿠키에 담기
                res.cookie("token", token,{
                    httpOnly : true
                })
                console.log(token)
                return res.status(StatusCodes.OK).json(results)
            }
            else{
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        }
    )

};
const PasswordResetRequest = (req, res) =>{
    const {email} = req.body;

    let sql = 'SELECT * FROM users WHERE email = ?';

    conn.query(sql, email,
        (err,results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            const user = results[0];
            if (user){
                return res.status(StatusCodes.OK).json({
                    email : email
                });
            }else{
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        }
    )
};
const PasswordReset = (req, res) =>{
    const {email, password} = res.body;

    let sql = 'UPDATE users SET password = ?, salt=? WHERE email = ?';

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000,10,'sha512').toString('base64');
    let values = [hashPassword,email, salt]

    conn.query(sql, values,
        (err,results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            
            if (results.affectedRows == 0){
                return res.status(StatusCodes.BAD_REQUEST).end();
            }else{
                return res.status(StatusCodes.OK).json(results);
            }
        }
    )
};
module.exports = {
    join,
    login,
    PasswordResetRequest,
    PasswordReset
};