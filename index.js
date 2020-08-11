const express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://anhquan:anhquan@cluster0.l9q6m.gcp.mongodb.net/test';

router.get('/', async (req, res)=>{
    let client = await MongoClient.connect(url);
    let dbo = client.db("MyDb");
    let results = await dbo.collection("products").find().toArray();
    res.render('index', {products:results});
})

router.post('/search', async (req, res)=>
{
    let client = await MongoClient.connect(url);
    let dbo = client.db("MyDb");
    var nameValue = "";
    if (req.body.search != null && req.body.search != ""){
        nameValue = req.body.search
        var searchProduct = {name : nameValue};
    }
    let results = await dbo.collection("products").find(searchProduct).toArray();
    res.render('index', {products:results});
})

router.get('/insert',(req, res)=>{
    res.render('insertProduct');
})

router.post('/insert',async (req, res)=>{
    let client = await MongoClient.connect(url);
    let dbo = client.db("MyDb");
    let nameValue = req.body.txtName;
    let priceValue = req.body.txtPrice;
    let categoryValue = req.body.txtCategory;


    for(let i = 1; i < 10; i++){
        if(categoryValue.includes(i.toString()) > 0){
            return res.render('insertProduct', {err: "Numbers are not allowed!"});
        }
    }
    
    if(categoryValue.length < 5) return res.render('insertProduct', {err: "Invalid Length!"});


    if (nameValue != null && priceValue != null && categoryValue != null) {
    let newProduct = 
    {
        name : nameValue,
        price : priceValue, 
        category : categoryValue
    };
    await dbo.collection("products").insertOne(newProduct);
    }
    let results = await dbo.collection("products").find({}).toArray();
    res.redirect('/');
})

router.delete('/delete/:id', async(req, res)=>
{
    let client = await MongoClient.connect(url);
    let dbo = client.db("MyDb");
    var nameValue = req.params.id;
    var deleteObject = {name : nameValue};
    dbo.collection("products").deleteOne(deleteObject)
    // let results = await dbo.collection("products").find().toArray();
    // res.render('index', {products:results});
})



module.exports = router;