const { response } = require("express");
const bcryptjs = require("bcryptjs");
const InformacionPage = require("../models/informacion");
const RegisterUsuario = require("../models/usuario");
const CreateUsuario = require("../models/UserCreate");
const { generarjwt } = require("../helpers/jwt");

const Registerusuario = async (req, res = response) => {
  try {
    const { password, usuario, correo } = req.body;
    const existUser = await CreateUsuario.findOne({ usuario });
    const exisEmail = await RegisterUsuario.findOne({ correo });
    if (!existUser) {
      return res.status(400).json({
        ok: false,
        msg: "el usuario no esta registrado",
      });
    }

    if (existUser.Creado) {
      return res.status(400).json({
        ok: false,
        msg: "el usuario ya esta registrado",
      });
    }
    if (exisEmail) {
      return res.status(400).json({
        ok: false,
        msg: "el Correo ya existe",
      });
    }
    await CreateUsuario.findByIdAndUpdate(existUser._id, { Creado: true });
    const newuser = new RegisterUsuario(req.body);
    const salt = bcryptjs.genSaltSync();
    newuser.password = bcryptjs.hashSync(password, salt);
    await newuser.save();

    const token = await generarjwt(newuser.id);
    res.json({
      ok: true,
      newuser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "hubo fallas en la base de datos",
    });
  }
};


const deleteUser = async (req,res) => {
    const { usuario } = req.body;
    try {
        let user = await RegisterUsuario.findById( req.uid );
        if(user.rol === "Admin"){
          await RegisterUsuario.findOneAndDelete({ usuario});  
         await CreateUsuario.findOneAndDelete({ usuario });
          res.status(200).json({
            ok:true
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

const createUser = async (req, res = response) => {
  try {
    const { usuario, referente } = req.body;
    const existUser = await CreateUsuario.findOne({ usuario });
    if (existUser) {
      return res.status(400).json({
        ok: false,
        msg: "el usuario ya existe",
      });
    }
    const newuser = new CreateUsuario(req.body);
    if (referente) {
      const userReferent = await RegisterUsuario.find({ usuario: referente });
      if (userReferent.length > 0) {
        const informacionPorcentaje = await InformacionPage.find();
        if (
          userReferent[0].porcentaje + informacionPorcentaje[0].porcentaje1 <
          100
        ) {
          await RegisterUsuario.findOneAndUpdate(
            { usuario: referente },
            {
              porcentaje:
                userReferent[0].porcentaje +
                informacionPorcentaje[0].porcentaje1,
              $push: {
                usuariosRef: newuser.usuario,
              },
            }
          );
        } else {
          await RegisterUsuario.findOneAndUpdate(
            { usuario: referente },
            {
              porcentaje: 100,
              $push: {
                usuariosRef: newuser.usuario,
              },
            }
          );
        }

        const userReferentFather = await RegisterUsuario.find({
          usuariosRef: { $all: [referente] },
        });

        console.log(userReferentFather);

        if (userReferentFather.length > 0) {
          if (
            userReferentFather[0].porcentaje +
              informacionPorcentaje[0].porcentaje2 <
            100
          ) {
            await RegisterUsuario.findOneAndUpdate(
              { usuario: userReferentFather[0].usuario },
              {
                porcentaje:
                  userReferentFather[0].porcentaje +
                  informacionPorcentaje[0].porcentaje2,
              }
            );
          } else {
            await RegisterUsuario.findOneAndUpdate(
              { usuario: userReferentFather[0].usuario },
              { porcentaje: 100 }
            );
          }

          const userReferentFather2 = await RegisterUsuario.find({
            usuariosRef: { $all: [userReferentFather[0].usuario] },
          });

          console.log(userReferentFather2);
          if (userReferentFather2.length > 0) {
            if (
              userReferentFather2[0].porcentaje +
                informacionPorcentaje[0].porcentaje3 <
              100
            ) {
              await RegisterUsuario.findOneAndUpdate(
                { usuario: userReferentFather2[0].usuario },
                {
                  porcentaje:
                    userReferentFather2[0].porcentaje +
                    informacionPorcentaje[0].porcentaje3,
                }
              );
            } else {
              await RegisterUsuario.findOneAndUpdate(
                { usuario: userReferentFather2[0].usuario },
                { porcentaje: 100 }
              );
            }
          }
        }
      } else {
        return res.status(400).json({
          ok: false,
          msg: "el referente no existe",
        });
      }
    }
    await newuser.save();
    res.json({
      ok: true,
      newuser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "hubo fallas en la base de datos",
    });
  }
};

const InicioSesion = async (req, res = response) => {
  const { usuario, password } = req.body;
  try {
    const usuarioBd = await RegisterUsuario.findOne({ usuario });
    if (!usuarioBd) {
      return res.status(404).json({
        ok: false,
        msg: "usuario no existe",
      });
    }
    const validarcontraseña = bcryptjs.compareSync(
      password,
      usuarioBd.password
    );
    if (!validarcontraseña) {
      return res.status(404).json({
        ok: false,
        msg: "contraseña incorrecta",
      });
    }
    const token = await generarjwt(usuarioBd.id);
    return res.json({
      ok: true,
      usuarioBd,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "hubo fallas en la base de datos de brous",
    });
  }
};

const renovar = async (req, res = response) => {
  const uid = req.uid;
  const token = await generarjwt(uid);
  const usuario = await RegisterUsuario.findById(uid);
  return res.json({
    ok: true,
    usuario,
    token,
  });
};

module.exports = {
  Registerusuario,
  InicioSesion,
  renovar,
  createUser,
  deleteUser,
};
