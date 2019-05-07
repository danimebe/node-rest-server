const jwt = require('jsonwebtoken');

//=========================
//      VERIFICAR TOKEN
//=========================

let verificaToken = (req,res, next) => {
    let token = req.get('token');

    jwt.verify(token,process.env.SEED,  (err , decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err: 'Token no válido'
            })
        }

        req.usuario = decoded.usuario;
        next();
    });
}


//=========================
//      VERIFICAR ADMIN ROLE
//=========================

let verificarAdminRole = (req,res,next) => {
    let usuario = req.usuario;

    if(usuario.role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok:false,
            err: 'No tiene permisos para realizar esta acción'
        })
    }

    next();
}

//=========================
//      VERIFICAR TOKEN
//=========================

let verificaTokenImg = (req,res, next) => {
    let token = req.query.token;

    jwt.verify(token,process.env.SEED,  (err , decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err: 'Token no válido'
            })
        }

        req.usuario = decoded.usuario;
        next();
    });
}


module.exports = {
    verificaToken,
    verificarAdminRole,
    verificaTokenImg
}