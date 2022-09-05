const {Router} = require('express');
const {validarjwt} = require('../helpers/regenerarjwt');
const {modificacionPorcentaje,createPor,infoPage} = require('../controllers/info');
const { check } = require('express-validator');
const { validacioncampos } = require('../middlewares/validador-de-campos');

const router = Router();
router.get('/info',infoPage);

router.post('/porcentaje',[
    check('porcentaje1','El porcentaje 1 tiene que estar entre 0 y 100').isFloat({min:0,max:100}),
    check('porcentaje2','El porcentaje 2 tiene que estar entre 0 y 100').isFloat({min:0,max:100}),
    check('porcentaje3','El porcentaje 3 tiene que estar entre 0 y 100').isFloat({min:0,max:100}),
    validacioncampos
], validarjwt, createPor);

router.put('/porcentaje',[
    check('porcentaje1','El porcentaje 1 tiene que estar entre 0 y 100').isFloat({min:0,max:100}),
    check('porcentaje2','El porcentaje 2 tiene que estar entre 0 y 100').isFloat({min:0,max:100}),
    check('porcentaje3','El porcentaje 3 tiene que estar entre 0 y 100').isFloat({min:0,max:100}),
    validacioncampos
], validarjwt, modificacionPorcentaje);
module.exports = router