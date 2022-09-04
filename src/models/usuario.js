const {Schema,model} = require('mongoose');
const userSchema = new Schema({
    nombre:  {
        type: String,
        required : true,
        trim: true,
    }, 
    apellido:  {
        type: String,
        required : true,
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
        required : true,
        unique: true,
        trim: true
    },
    password:{
       type: String,
       required : true,

    },
    rol:{
        type: String,
        trim: true,
        default: 'User'
    },
    porcentaje:{
        type: Number,
        required : true,
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