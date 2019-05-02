const express = require('express');
const app = express();
const Categoria = require('../models/categoria');
const {verificaToken} = require('../middlewares/autenticacion');

app.post('/categoria',verificaToken,(req,res) =>{
    let body = req.body

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err,categoriaDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        })


    })
})
app.get('/categoria/:id',verificaToken,(req , res) => {
    let id = req.params.id

    Categoria.findOne({_id: id},(err , categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: `No se encontró la categoría con id: ${id}`
            })
        }

        res.status(200).json({
            ok: true,
            categoriaDB
        })
    })
})

app.get('/categoria',verificaToken,(req, res) => {

    Categoria.find({}).sort('descripcion').populate('usuario').exec((err,categorias) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            categorias
        })
    })

})

app.put('/categoria/:id',verificaToken,(req , res) => {
    let id = req.params.id
    let body = req.body

    Categoria.findByIdAndUpdate(id,body, {new: true}, (err, categoriaDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoriaDB
        })
    })

})

app.delete('/categoria/:id', verificaToken , (req , res) => {
    let id = req.params.id
    
    Categoria.findByIdAndRemove(id,(err , categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: `No se encontró categoría con el id ${id}`
            })
        }

        res.json({
            ok: true,
            categoriaDB
        })
    })
})


module.exports = app;