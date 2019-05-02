const express = require('express');
const app = express();
const Producto = require('../models/producto');
const { verificaToken } = require('../middlewares/autenticacion');

app.post('/producto',verificaToken,(req , res) => {
    let body = req.body

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err , productoBD) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            productoBD
        })
    })
})

app.get('/producto',verificaToken,(req , res) => {

    let limite = Number(req.query.limite) || 5
    let desde = Number(req.query.desde) || 0

    Producto.find({disponible: true}).sort('nombre').skip(desde).limit(limite).populate('usuario','nombre email')
                        .populate('categoria','descripcion')
                        .exec((err , productos) => {
                            if(err){
                                return res.status(500).json({
                                    ok: false,
                                    err
                                })
                            }

                            res.json({
                                ok: true,
                                productos
                            })
                        })
})

app.get('/producto/:id',verificaToken,(req , res) => {
    let id = req.params.id

    Producto.findById(id, (err , productoBD) => {
        if(err){
            res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoBD){
            res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró el producto'
                }
            })
        }

        res.json({
            ok:true,
            productoBD
        })
    }).populate('usuario','nombre email').populate('categoria','descripcion');
})

app.put('/producto/:id',verificaToken,(req , res) => {
    let id = req.params.id
    let body = req.body

    Producto.findByIdAndUpdate(id,body,{new: true , runValidators: true},(err, productoBD) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoBD){
            return res.status(400).json({
                ok: true,
                err: {
                    message: 'No se encontró el producto'
                }
            })
        }
        
        res.json({
            ok: true,
            productoBD
        })

    }).populate('usuario','nombre email').populate('categoria','descripcion');
})

app.delete('/producto/:id',verificaToken,(req , res) => {
    let id = req.params.id;
    
    Producto.findByIdAndUpdate(id,{disponible: false},{new: true, runValidators: true},(err , productoBD) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoBD){
            return res.status(400).json({
                ok: true,
                err: {
                    message: 'No se encontró el producto'
                }
            })
        }
        
        res.json({
            ok: true,
            productoBD
        })

    }).populate('usuario','nombre email').populate('categoria','descripcion');
})

app.get('/producto/buscar/:busqueda', verificaToken , (req , res) => {
    

    let busqueda = req.params.busqueda;

    let regex = new RegExp(busqueda, 'i');

    Producto.find({nombre: regex, disponible: true}).populate('usuario','nombre email')
                                  .populate('categoria','descripcion')
                                  .exec((err, productos) => {
                                      if(err){
                                          return res.status(500).json({
                                              ok: false,
                                              err
                                          })
                                      }

                                      if(!productos){
                                          return res.status(400).json({
                                              ok: false,
                                              err: {
                                                  message: 'No se encontraron productos'
                                              }
                                          })
                                      }

                                      res.json({
                                          ok: true,
                                          productos
                                      })
                                  })


    Producto.find({})
})




module.exports = app;