const {Schema,model} = require('mongoose');
const userSchema = new Schema({
    nombre:  {
        type: String,
        trim: true,
    }, 
    apellido:  {
        type: String,
        trim: true,
    },
    usuario:{
        type: String,
        required : true,
        trim: true,
    },
    usuariosRef:{
        type: Array,
        default:[]
    },
    correo:{
        type: String,
        trim: true,
        default:"",
        
    },
    password:{
       type: String,

    }, 
    Creado:  {
        type: Boolean,
        trim: true,
        default:false
    },
    rol:{
        type: String,
        trim: true,
        default: 'User'
    },
    porcentaje:{
        type: Number,
        default: 0
    },
    creacion : {
        type: Date,
        default: Date.now
    }}
);

userSchema.method('toJSON', function(){
    const { __V, _id,...object} = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('Users', userSchema);