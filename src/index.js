const express = require('express');
const Sequelize = require('sequelize');
const app = express();
app.use(express.json());


// const sequelize = new Sequelize('database','username','password',{
//     host: 'localhost',
//     dialect: 'sqlite',
//     storage: './Database/SQBooks.sqlite'
// });
const dbUrl = 'postgres://webadmin:AMVfvi78563@node56356-noderestx.proen.app.ruk-com.cloud:11894/Books';
const sequelize = new Sequelize(dbUrl);

const Book = sequelize.define('book',{ //1 table
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true, //ให้เพิ่ม id เอง
        primaryKey: true
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false  // ต้องมีไม่มีไม่ได้
    },
    author:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

sequelize.sync(); //ถ้ามีแล้วจะเรียกถ้าไม่มีสร้างใหม่

app.get('/books',(req,res)=>{
    Book.findAll().then(books=>{ //หาไฟล์bookได้จะreturn json
        res.json(books);
    }).catch(err=>{
        res.status(500).send(err); //หาถ้าไม่ได้ส่ง status500
    });
});

app.get('/books/:id',(req,res)=>{
    Book.findByPk(req.params.id).then(book=>{ //หาโดยใช้ pk
        if (!book) {
            res.status(404).send('Book not found');
        }else{
            res.json(book);
        }
    }).catch(err => { //จับ error
        res.status(500).send(err);
    });
});

app.post('/books',(req,res)=>{
    Book.create(req.body).then(book => {
        res.send(book);
    }).catch(err =>{
        res.status(500).send(err);
    });
});

app.put('/books/:id',(req,res)=>{
    Book.findByPk(req.params.id).then(book=>{
        if(!book){
            res.status(404).send('Book not found');
        }else{
            book.update(req.body).then(()=>{
                res.send(book);
            }).catch(err =>{
                res.status(500).send(err); //send be not found
            });
        }
    }).catch(err =>{
        res.status(500).send(err);
    });
});

app.delete('/books/:id',(req,res)=>{
    Book.findByPk(req.params.id).then(book=>{
        if (!book) {
            res.status(404).send('Book not found');
        } else {
            book.destroy().then(()=>{
                res.send({});
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

const port = process.env.PORT || 3000;
app.listen(port,() => console.log(`Listening on port ${port}...`));