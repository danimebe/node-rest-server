
//=====================================
//          PORT
//=====================================

process.env.PORT = process.env.PORT || 3000;


//=====================================
//          ENTORNO
//=====================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================================
//          BASE DE DATOS
//=====================================

process.env.URLDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : 'mongodb+srv://danimb:Tkllz0ltkApyvERV@cluster0-kvzic.mongodb.net/cafe';

