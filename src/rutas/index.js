const { Router } = require('express');
const router = Router();

const { Registerusuario, InicioSesion, renovar,createUser,deleteUser } = require('../controllers/auth');
const { check } = require('express-validator');
const { validacioncampos } = require('../middlewares/validador-de-campos');
const { validarjwt } = require('../helpers/regenerarjwt');


router.post('/login', [
    check('usuario','El usuario es obligatorio').notEmpty(),
    check('password','El password es obligatorio').notEmpty(),
    validacioncampos
],InicioSesion);


router.post('/register', [
    check('nombre','El nombre es obligatorio').notEmpty(),
    check('apellido','El apellido es obligatorio').notEmpty(),
    check('usuario','El usuario es obligatorio').notEmpty(),
    check('correo','No es un correo valido').isEmail(),
    check('password','La contrasena es obligatorio').notEmpty(),
    validacioncampos
],Registerusuario);


router.post('/user', [
    check('usuario','El usuario es obligatorio').notEmpty(),
    validacioncampos
],validarjwt,createUser);

router.delete('/user', [
    check('usuario','El usuario es obligatorio').notEmpty(),
    validacioncampos
],validarjwt ,deleteUser);


router.get('/renovacion', validarjwt , renovar );


module.exports = router;


