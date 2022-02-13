const express = require('express');
const { Deta } = require('deta');
require('dotenv').config();

// configure your Deta project
const deta = Deta(process.env.KEY); 

// access your DB
const db = deta.Base('Blogs');

const app = express(); // instantiate express
app.use(express.json()) // for parsing application/json bodies

app.get('/',(req,res)=> res.send("Welcome Here !"))

app.post('/newBlog',async(req,res)=>{
    let newPost = {
        Title : req.body.Title,
        Content : req.body.Content
    }
    let result = await db.put(newPost);
    if (result) {
        res.json({"message" : "Inserted To DB successFully"});
    }else{
        res.status(500).json({"message" : "error While sending"});        
    }
}); 

app.get('/allBlogs', async(req, res) => {
    const blogs = await db.fetch({});
    if (blogs) {
        res.json(blogs);        
    } else {
        res.status(404).json({"message": "No Blog Post Found!"});
    }
});
app.get('/blog/:postKey', async(req,res)=>{

    let {postKey} = req.params;
    console.log(postKey);

    const blog = await db.get(postKey);
    if (blog) {
        res.json(blog);        
    } else {
        res.status(404).json({"message": "No Blog Post Found!"});
    }
})

// app.listen(5500, ()=>{
//     console.log("Listning ");
// });

// export 'app'
module.exports = app