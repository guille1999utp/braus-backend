const { response } = require("express");
const bcryptjs = require("bcryptjs");
const InformacionPage = require("../models/informacion");
const RegisterUsuario = require("../models/usuario");
const { generarjwt } = require("../helpers/jwt");

const Registerusuario = async (req, res = response) => {
  try {
    const { password, usuario, correo,...rest } = req.body;
    const existUser = await RegisterUsuario.findOne({ usuario });
    const exisEmail = await RegisterUsuario.findOne({ correo });
    if (!existUser) {
      return res.status(400).json({
        ok: false,
        errors: {
          msg:"el usuario no esta registrado",
          }
      });
    }

    if (existUser.Creado) {
      return res.status(400).json({
        ok: false,
        errors: {
          msg:"el usuario ya esta registrado"
        },
      });
    }
    if (exisEmail) {
      return res.status(400).json({
        ok: false,
        errors: {
          msg:"el Correo ya existe",
        }
      });
    }
    const salt = bcryptjs.genSaltSync();
    const newPassword = bcryptjs.hashSync(password, salt);
    await RegisterUsuario.findByIdAndUpdate(existUser._id, {...rest, Creado: true,usuario, correo,password:newPassword });
    const newuser = await RegisterUsuario.findById(existUser._id)
    const token = await generarjwt(newuser.id);
    delete newuser.password;
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
    const existUser = await RegisterUsuario.findOne({ usuario });
    if (existUser) {
      return res.status(400).json({
        ok: false,
        msg: "el usuario ya existe",
      });
    }
    const newuser = new RegisterUsuario(req.body);
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

const CompraUser = async (req, res = response) => {
  try {
    const { usuario } = req.body;
    const noExistUser = await RegisterUsuario.findOne({ usuario });
    if (!noExistUser) {
      return res.status(400).json({
        ok: false,
        msg: "el usuario no existe",
      });
    }
    const userReferent = await RegisterUsuario.findOne({ usuariosRef: [usuario] });
    if (userReferent) {
        const informacionPorcentaje = await InformacionPage.find();
        if (
          userReferent.porcentaje + informacionPorcentaje[0].porcentaje1 <
          100
        ) {
          await RegisterUsuario.findOneAndUpdate(
            { usuario: userReferent.usuario },
            {
              porcentaje:userReferent.porcentaje + informacionPorcentaje[0].porcentaje1
            }
          );
        } else {
          await RegisterUsuario.findOneAndUpdate(
            { usuario: userReferent.usuario },
            {
              porcentaje: 100,
            }
          );
        }

        const userReferentFather = await RegisterUsuario.find({
          usuariosRef: { $all: [userReferent.usuario] },
        });

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
    }else {
      return res.status(400).json({
        ok: false,
        msg: "el referente no existe",
      });
    }
    res.json({
      ok: true,
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
    const usuarioBd = await RegisterUsuario.findOne({ usuario:usuario.toLowerCase() });
    if (!usuarioBd) {
      return res.status(404).json({
        ok: false,
        errors:{
          msg: "usuario no existe",
        }
      });
    }

    if (!usuarioBd.Creado) {
      return res.status(404).json({
        ok: false,
        errors:{
          msg: "debes registrarte antes de ingresar",
        }
      });
    }


    const validarcontraseña = bcryptjs.compareSync(
      password,
      usuarioBd.password
    );
    if (!validarcontraseña) {
      return res.status(404).json({
        ok: false,
        errors:{
          msg: "contraseña incorrecta",
        }
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
      errors:{
      msg: "hubo fallas en la base de datos de brous"
      }
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
  CompraUser
};
