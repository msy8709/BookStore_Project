const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const allBooks = (req,res) => {
    let {category_id, news, limit, currentPage} = req.query;
    //limit : page 당 도서 수
    //currentPage : 현재 몇 페이지
    //offset: (currentPage-1) * limit
    let offset = (currentPage-1) * limit;
    let values = [];
    let sql = "SELECT *, (select count(*) from likes WHERE book.id = liked_book_id) AS likes FROM books";
    if(category_id && news){
        sql += "WHERE category_id = ? AND pub_date BETWEEN  DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW();";
        values = [category_id]
    }else if(category_id){
        sql += "WHERE category_id = ?";
        values = [category_id]
    }else if(news){
        sql += "WHERE pub_date BETWEEN  DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW();";
       
    }
    sql += "LIMIT ? OFFSET ?";
    values.push(parseInt(limit),offset);

    conn.query(sql, values, (err,results) => {
        if(err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        if(results.length){
            return res.status(StatusCodes.OK).json(results)
        }
        else{
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    })

    conn.query(sql, (err,results) => {
        if(err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        return res.status(StatusCodes.OK).json(results)
    })
    
    
}
const BookDetail = (req,res) => {
    let {user_id} = req.params;
    let {book_id} = req.params.id;

    
    let sql = "SELECT *,(SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,(SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?) AS likedFROM books LEFT JOIN category ON books.category_id = category.category_id WHERE books.id=?;"
    let values = [user_id,book_id,book_id]
    conn.query(sql, values, (err,results) => {
        if(err){
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        if(results[0]){
            return res.status(StatusCodes.OK).json(results[0])
        }
        else{
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    })
}
const booksByCategory = (req,res) => {
    
}

module.exports = {
    allBooks, BookDetail, booksByCategory
}