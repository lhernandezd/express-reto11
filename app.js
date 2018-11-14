const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routes = require('./routes'); //Requerimos el archivo de rutas
const cookieParser = require('cookie-parser');//Cookies
const cookieSession = require('cookie-session'); //Middleware para las sesiones

//Settings
app.set('view engine','pug');
app.set('views','views');
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/registrations', { useNewUrlParser: true });//Conexion a mongodb y creacion de la base de datos registrations

//Middlewares
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
})); //Configuracon de las sesiones
app.use(express.urlencoded()); //Para leer el cuerpo de las peticiones hechas por los formularios.
app.use('/static',express.static(__dirname + '/public')); //Para acceder a lo que se encuentra en la carpeta public.
app.use('/',routes);

//Port
app.listen(3000, () => {
  console.log('Listening on port 3000!');
});