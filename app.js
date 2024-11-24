const express = require('express');
const app = express();
const path = require("path");
const fs = require("fs");


app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,"public")))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.get("/", async(req,res)=>{
    await fs.readdir('./hisaab',function(err,files){
        if(err) return  res.status(500).send(err);
        res.render("index",{files:files})
    });
});


app.get("/create",function(req,res){
    res.render("create");
})

app.post("/createhisaab",function(req,res){
    var now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const date = `${day}-${month}-${year}.txt`;

        fs.writeFile(`./hisaab/${date}`, req.body.content, (err) => {
        if (err) return res.status(500).send(err);
            res.redirect("/");
    });
})


app.get("/edit/:filename",function(req,res){
    const filename = req.params.filename;
    fs.readFile(`./hisaab/${filename}`,'utf8',function(err,filedata){
        if(err) return res.status(500).send(err);
        res.render("edit",{filedata,filename:filename})
    })
})

app.post("/update/:filename",function(req,res){
    const filename = req.params.filename;
    fs .writeFile(`./hisaab/${filename}`,req.body.content,function(err){
        if(err) return res.status(500).send(err);
        res.redirect("/")
    })
})


app.get("/hisaab/:filename",function(req,res){
    const filename = req.params.filename;
    fs.readFile(`./hisaab/${filename}`,'utf8',function(err,filedata){
        if(err) return res.status(500).send(err);
        res.render("hisaab",{filedata,filename:filename})
    })
})

app.get("/delete/:filename",function(req,res){
    const filename = req.params.filename;
    fs.unlink(`./hisaab/${filename}`,function(err){
        if(err) return res.status(500).send(err);
        res.redirect("/")
    })
})













// app.post("/createhisaab", (req, res) => {
//     const now = new Date();
//     const day = String(now.getDate()).padStart(2, "0");
//     const month = String(now.getMonth() + 1).padStart(2, "0");
//     const year = now.getFullYear();
//     const fn = `${day}-${month}-${year}.txt`;

//     fs.writeFile(`./files/${fn}`, req.body, (err) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send("Failed to write file.");
//         } else {
//             res.send(`File ${fn} created successfully.`);
//         }
//     });
// });
// app.get("/read", (req, res) => {
//     const now = new Date();
//     const day = String(now.getDate()).padStart(2, "0");
//     const month = String(now.getMonth() + 1).padStart(2, "0");
//     const year = now.getFullYear();
//     const fn = `${day}-${month}-${year}.txt`;

//     fs.readFile(`./files/${fn}`, 'utf8', (err, data) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send("Failed to read file.");
//         } else {
//             res.send(data);
//         }
//     });
// });




app.get("/",(req,res)=>{
    res.send("hey");
})

app.get("/create",(req,res)=>{
    
})

app.listen(3000);