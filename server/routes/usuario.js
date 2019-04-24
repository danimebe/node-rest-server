const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const {verificaToken,verificarAdminRole} = require('../middlewares/autenticacion');
const _ = require('underscore');


app.get('/usuario',verificaToken, (req, res) => {
    
    let limite = Number(req.query.limite) || 5
    let desde = Number(req.query.desde) || 0
    
    Usuario.find({estado: true},'nombre email role estado google img').skip(desde).limit(limite).exec( (err, usuarios) => {


        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        Usuario.countDocuments({estado: true}, (err , conteo) => {
            res.json({
                ok: true,
                cuantos: conteo,
                usuarios
            });
        })
    })
  })
  
  app.post('/usuario',[verificaToken,verificarAdminRole], function (req, res) {


    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        role: body.role
    })


    
    usuario.save((err, usuarioDB) => {

       if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    }); 
})
  
  app.put('/usuario/:id',[verificaToken,verificarAdminRole], function (req, res) {
      
      let id = req.params.id;
      let body = _.pick(req.body,['nombre','email','img','role','estado']);

      Usuario.findByIdAndUpdate(id, body,{new: true , runValidators: true} , (err, usuarioDB) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
              ok:true,
              usuario: usuarioDB
        });
      })

  })
  
  app.delete('/usuario/:id',[verificaToken,verificarAdminRole], function (req, res) {
    
    let id = req.params.id

      Usuario.findByIdAndUpdate(id,{estado: false}, {new: true}, (err, usuarioBorrado) => {
          if (err){
              res.status(400).json({
                  ok: false,
                  err
              })
          }

          res.json({
              ok: true,
              usuarioBorrado
          })
      });
    });

  module.exports = {
    app
  } 