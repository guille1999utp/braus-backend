const Producto = require('../models/producto');
const Usuario = require('../models/usuario');
const cloudinary = require('../utils/cloudinary');

const crearProducto = async (req,res) => {
try {
    let user = await Usuario.findById( req.uid );
    if(user.rol === "Admin"){
      const newProducto = new Producto(req.body);
      await newProducto.save();
      const newProd = await Producto.find()

      res.status(200).json({
        ok:true,
        newProd
        })
   }else{
      return res.status(401).json({
           ok:false,
           msg:"no tienes permisos para hacer esta accion"
       })
   }
    
} catch (error) {
    console.log(error);
    res.status(400).json({
        ok:false,
        msg:'no se creo el producto con exito'
    })
}
    }

    const deleteProduct = async (req,res) => {
        try {
            let user = await Usuario.findById( req.uid );
            if(user.rol === "Admin"){
              const newProd = await Producto.findByIdAndDelete(req.body.pid);
              await cloudinary.cloudinary.uploader.destroy(newProd.fotosId, {type : 'upload', resource_type : 'image'}, (res)=>{
                return res;
           });
              res.status(200).json({
                ok:true,
                })
           }else{
              return res.status(401).json({
                   ok:false,
                   msg:"no tienes permisos para hacer esta accion"
               })
           }
            
        } catch (error) {
            console.log(error);
            res.status(400).json({
                ok:false,
                msg:'no se elimino el producto con exito'
            })
        }
            }
    
    const getProducts = async (req,res) => {
        try {
            const products = await Producto.find();
            res.status(200).json({
                ok:true,
                products
                })  
        } catch (error) {
            res.status(500).json({
                ok:false,
                msg:"error en la base de datos"
                }) 
        }
    }


    const modificarProducto = async (req,res) => {
      try { 
        let user = await Usuario.findById( req.uid );
        if(user.rol === "Admin"){
            const {id,...rest} = req.body
            
            console.log(req.body)
          const prodUpdate = await Producto.findByIdAndUpdate(id,rest);
          console.log(prodUpdate.fotosId !== rest.fotosId)
          if(prodUpdate.fotosId !== rest.fotosId){
            console.log(prodUpdate,rest)
            await cloudinary.cloudinary.uploader.destroy(prodUpdate.fotosId, {type : 'upload', resource_type : 'image'}, (res)=>{
                return res;
           });
          }
          res.status(200).json({
              ok:true,
              prodUpdate
              })   
        }else{
            return res.status(401).json({
                 ok:false,
                 errors:{
                     msg:"no tienes permisos para hacer esta accion"
                 }
             })
         }
      } catch (error) {
          console.log(error);
          res.status(400).json({
              ok:false,
              errors:{
              msg:'no se creo el producto con exito'
               }
          })
      }

        }

      
module.exports ={
    crearProducto,
    modificarProducto,
    getProducts,
    deleteProduct
}