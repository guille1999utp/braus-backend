const Usuario = require('../models/usuario');
const Informacion = require('../models/informacion');

const modificacionPorcentaje = async (req,res) => {
    try {
        let user = await Usuario.findById( req.uid );
        if(user.rol === "Admin"){
           const newPorc = await Informacion.updateMany( {}, req.body );
           return res.status(200).json({
            ok:true,
            newPorc
        })
        }else{
           return res.status(401).json({
                ok:false,
                msg:"no tienes permisos para hacer esta accion"
            })
        }

      
    } catch (error) {
        console.log(error);
    }
    }

    const getInfo = async (req,res) => {
        try {
            let user = await Usuario.findById( req.uid );
            if(user.rol === "Admin"){
               const info = await Informacion.find();
               return res.status(200).json({
                ok:true,
                info
            })
            }else{
               return res.status(401).json({
                    ok:false,
                    msg:"no tienes permisos para hacer esta accion"
                })
            }
    
          
        } catch (error) {
            console.log(error);
        }
        }

    
const createPor = async (req,res) => {
    try {
        let user = await Usuario.findById( req.uid );
        if(user.rol === "Admin"){
            const newPorc = new Informacion(req.body);
           await newPorc.save();
           return res.status(200).json({
            ok:true,
            newPorc
        })
        }else{
           return res.status(401).json({
                ok:false,
                msg:"no tienes permisos para hacer esta accion"
            })
        }

       
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok:false,
            msg:"error al crear la informacion"
            
        })
    }
    }

    const infoPage = async (req,res) => {
        try {
            let info = await Informacion.find();
               return res.status(200).json({
                ok:true,
                info:info[0]
            })   
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                ok:false,
                msg:"error al crear la informacion"
                
            })
        }
        }

module.exports ={
    modificacionPorcentaje,
    createPor,
    getInfo
}