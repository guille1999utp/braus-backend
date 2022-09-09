const {Router} = require('express');
const {crearProducto ,modificarProducto,getProducts,deleteProduct} = require('../controllers/productos');
const { validacioncampos } = require('../middlewares/validador-de-campos');
const {validarjwt} = require('../helpers/regenerarjwt');
const { check } = require('express-validator');

const router = Router();

router.post('/producto',[
check('titulo','El titulo es obligatorio').notEmpty(),
check('precio','El precio es obligatorio').notEmpty(),
check('fotosdescripsion','El titulo es obligatorio').notEmpty(),
check('fotosId','El precio es obligatorio').notEmpty(),
validacioncampos],
validarjwt,
crearProducto);

router.delete('/producto',[
    check('pid','El id del producto es obligatorio').notEmpty(),
    check('pid','El id no es valido').isMongoId(),
    validacioncampos],
    validarjwt,
    deleteProduct);

router.get('/producto',getProducts);

router.put('/producto',[
    check('id','El id del producto es obligatorio').notEmpty(),
    check('fotosdescripsion','error en subida de foto').notEmpty(),
    check('titulo','El titulo es obligatorio').notEmpty(),
    check('precio','El precio es obligatorio').notEmpty(),
    check('fotosId','error en subida de foto').notEmpty(),
    validacioncampos],
    validarjwt,
    modificarProducto)

module.exports = router