const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


app.post('/login', (req, res) => {
    
    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                err: '(Usuario) o contraseña incorrectos'
            })
        }

        if(!bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                err: 'Usuario o (contraseña) incorrectos'
            })
        }

        res.status(200).json({
            ok: true,
            usuarioDB,
            token: jwt.sign({
                usuario: usuarioDB
            },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN})
        })
    })
})

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture
    }

  }

app.post('/google', async (req,res) => {
    let body = req.body;

    let googleUser = await verify(body.idtoken)
                                .catch(e => {
                                    return res.status(403).json({
                                        ok: false,
                                        err: e
                                    })
                                });

    
    Usuario.findOne({email: googleUser.email},(err, usuarioDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if( usuarioDB ){

            if(!usuarioDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe utilizar la autenticación normal'
                    }
                })
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB    
                },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            // Si el usuario no existe en la db
            let usuario = new Usuario({
                nombre: googleUser.nombre,
                email: googleUser.email,
                img: googleUser.img,
                password: ':V',
                google: true
            })

            usuario.save((err,usuarioDB) => {
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }

                let token = jwt.sign({
                    usuario: usuarioDB    
                },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            })
        }
    })
})
    
   /*  return res.json({
        usuario: googleUser.nombre
    }) */

module.exports = app
