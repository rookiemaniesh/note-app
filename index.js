const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.get('/', function(req,res){
    fs.readdir('./files',function(err,files){
        res.render("index", {files:files}); 
     })
    
})
app.post('/create', function(req,res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.desc, function(err){
        if(err) throw err;
        res.redirect('/');
    })  
    
})
app.get('/files/:filename', function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, 'utf8', function (err, filedata) {
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});
app.get('/edit/:filename', function (req, res) {
    res.render('edit', { filename: req.params.filename });
});
app.post('/edit', function (req, res) {
    fs.rename(`./files/${req.body.prevName}`, `./files/${req.body.newName}`, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Error renaming file');
        }
        res.redirect('/');
    });
});
app.post('/delete', function (req, res) {
    fs.unlink(`./files/${req.body.filename}`, function (err){
        res.redirect('/');
    })
});
app.listen(3000);