const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se pudo subir el archivo'
            }
        })
      }

      let tipo = req.params.tipo;
      let id = req.params.id;

      let tiposPermitidos = ['productos' , 'usuarios'];

      if (tiposPermitidos.indexOf(tipo) < 0){
          res.status(400).json({
              ok: false,
              err: {
                  message: 'Los tipos permitidos son: ' + tiposPermitidos.join(',')
              }
          })
      }

      

      let file = req.files.file;

      let nombreArchivoCortado = file.name.split('.');

      let ext = nombreArchivoCortado[nombreArchivoCortado.length - 1];

      let extensionesValidas = ['jpg','png','jpeg','gif'];

      if (extensionesValidas.indexOf(ext) < 0){
          return res.status(400).json({
              ok: false,
              err: {
                  message: 'Las extenciones permitidas son ' + extensionesValidas.join(', '),
                  ext
              }
          })
      }
      

      let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${ext}`

      file.mv(`./uploads/${ tipo }/${nombreArchivo}`, err => {
          if (err)
            return res.status(500).json({
                ok: false,
                err
            })
            
            if( tipo === 'productos'){
                cargarImagenProducto(id , res , nombreArchivo);
            } else {
                cargarImagenUsuario(id,res,nombreArchivo);
            }

          
      })
})

let cargarImagenUsuario = (id , res, nombreArchivo ) => {
    
    Usuario.findById(id,(err,usuarioDB) => {
        if (err){
            borrarArchivo(nombreArchivo , 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB){
            borrarArchivo(nombreArchivo , 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        borrarArchivo(usuarioDB.img , 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save( (err , usuarioGuardado ) => {
            
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })


    })
}

let cargarImagenProducto = (id, res , nombreImagen) => {

    Producto.findById(id , (err , productoDB) => {

        if(err){
            borrarArchivo(nombreImagen, 'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB){
            borrarArchivo(nombreImagen, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró el producto'
                }
            })
        }

        borrarArchivo(productoDB.img, 'productos');
        productoDB.img = nombreImagen;

        productoDB.save((err , productoGuardado) => {
            res.json({
                ok: true,
                productoGuardado,
                img: nombreImagen
            })
        })

    })
}

let borrarArchivo = (nombreArchivo , tipo) => {

    let pathImage = path.resolve(__dirname , `../../uploads/${ tipo }/${nombreArchivo}`);

    if (fs.existsSync(pathImage)){
        fs.unlinkSync(pathImage);
    }

}

module.exports = app;