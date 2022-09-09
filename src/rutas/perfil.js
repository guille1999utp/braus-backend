const {Router} = require('express');
const {validarjwt} = require('../helpers/regenerarjwt');
const {modificacionPorcentaje,usersTodo,usersCreateTodo} = require('../controllers/perfil');
const { check } = require('express-validator');
const { validacioncampos } = require('../middlewares/validador-de-campos');

const router = Router();
router.get('/usuarios',usersTodo);
router.get('/usuariosCreados',usersCreateTodo);
router.put('/usuarios',[
    check('id','El id es obligatorio').notEmpty(),
    check('porcentaje','El porcentaje es obligatorio').notEmpty(),
    check('porcentaje','El porcentaje tiene que ser un numero decimal').isNumeric().isDecimal(),
    check('porcentaje','El porcentaje tiene que estar entre 0 y 100').isFloat({min:0,max:100}),
    validacioncampos
], validarjwt, modificacionPorcentaje);
module.exports = router