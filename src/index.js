const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
require('./database');
const app = express();
const server = http.createServer(app);
app.set('port', process.env.PORT);
app.use(express.static(path.resolve(__dirname, '../public')));
app.use(cors());
app.use(express.json());

//rutas
app.use(require('./rutas/index'))
app.use(require('./rutas/perfil'))
app.use(require('./rutas/productos'))
app.use(require('./rutas/info'))


server.listen(app.get('port'),()=>{
    console.log('escuchando en el puerto ', app.get('port'));
});