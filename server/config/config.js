
//=====================================
//          PORT
//=====================================

process.env.PORT = process.env.PORT || 3000;


//=====================================
//          ENTORNO
//=====================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================================
//          TOKEN EXPIRES
//=====================================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//=====================================
//          TOKEN SEED
//=====================================
process.env.SEED = process.env.NODE_ENV === 'dev' ? 'development-seed' : process.env.SEED; 


//=====================================
//          BASE DE DATOS
//=====================================

process.env.URLDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_URI;

