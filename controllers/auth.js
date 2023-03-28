const { response } = require("express");
const bcrypt = require('bcryptjs');
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const usuario = require("../models/usuario");


const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if( existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya se encuentra registrado'
            });
        }



        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Genera mi JWT
        const token = await generarJWT( usuario.id );


        res.json({
            ok: true,
            usuario,
            token
        }); 
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el administrador de la aplicacion'
        });
    }


    

}

const login = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        const usuarioDB = await Usuario.findOne({ email });
        
        if( !usuarioDB){
            return res.status(404).json({
                ok: false,
                msg:'El correo o contraseña no es valido'
            });
        }

        const validarPassword = bcrypt.compareSync( password, usuarioDB.password);
        if( !validarPassword){
            return res.status(404).json({
                ok: false,
                msg:'El correo o contraseña no es valido'
            });
        }

         // Genera mi JWT
         const token = await generarJWT( usuarioDB.id );

         res.json({
            ok: true,
            usuario: usuarioDB,
            token
        }); 
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el administrador de la aplicacion'
        });
    }
}

const renewToken = async(req, res = response) => {

    //obtener uoid del usuario
    const uid = req.uid;

    // Genera nuevo JWT
    const token = await generarJWT( uid );
   
        
    const usuario = await Usuario.findById( uid );

   

    res.json({
       ok: true,
       usuario,
       token
   }); 
        

}


module.exports = {
    crearUsuario,
    login,
    renewToken
}