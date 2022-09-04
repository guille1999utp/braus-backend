const Usuario = require('../models/usuario');

const usersTodo = async (req,res) => {
try {
    const user = await Usuario.find();
    res.json({
        ok:true,
        user})
} catch (error) {
    console.log(error);
    res.json({
        ok:false,
        msg:'no se encontro usuarios'
    })
}
}


const modificacionPorcentaje = async (req,res) => {
    try {
        let user = await Usuario.findById( req.uid );
        
        if(user.rol === "Admin"){
           user = await Usuario.findByIdAndUpdate( req.body.id, {
                porcentaje: req.body.porcentaje
            } );
        }else{
           return res.status(401).json({
                ok:false,
                msg:"no tienes permisos para hacer esta accion"
            })
        }

       return res.status(200).json({
            ok:true,
            user
        })
    } catch (error) {
        console.log(error);
    }
    }

module.exports ={
    modificacionPorcentaje,
    usersTodo,
}