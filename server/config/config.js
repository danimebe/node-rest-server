
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
process.env.CADUCIDAD_TOKEN = '48h';

//=====================================
//          TOKEN SEED
//=====================================
process.env.SEED = process.env.NODE_ENV === 'dev' ? 'development-seed' : process.env.SEED; 


//=====================================
//          BASE DE DATOS
//=====================================

process.env.URLDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_URI;

//=====================================
//          PUBLIC GOOGLE KEY
//=====================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '641365011901-csi04rpdpmpe4947s659sd4eq5tecpkc.apps.googleusercontent.com';