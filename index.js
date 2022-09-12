const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
require('./src/database');
const app = express();
const server = http.createServer(app);
app.set('port', process.env.PORT);
app.use(express.static(path.resolve(__dirname, '../public')));
app.use(cors());
app.use(express.json());

//rutas
app.use(require('./src/rutas/index'))
app.use(require('./src/rutas/perfil'))
app.use(require('./src/rutas/productos'))
app.use(require('./src/rutas/info'))


server.listen(app.get('port'),()=>{
    console.log('escuchando en el puerto ', app.get('port'));
});