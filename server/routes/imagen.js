const express = require('express');
let app = express();
const fs = require('fs');
const path = require('path');
let { verificaTokenImg } = require('../middlewares/autenticacion');

app.get('/imagen/:tipo/:img',verificaTokenImg , (req , res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = fs.existsSync(path.resolve(__dirname , `../../uploads/${tipo}/${img}`)) ? path.resolve(__dirname , `../../uploads/${tipo}/${img}`) : path.resolve(__dirname , `../assets/no-image.jpg`);

    res.sendFile(pathImg);

})

module.exports = app;