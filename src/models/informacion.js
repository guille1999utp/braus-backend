const {Schema,model} = require('mongoose');
const Informacion = new Schema({
    porcentaje1:  {
        type: Number,
        default:0
    },
    porcentaje2:  {
        type: Number,
        default:0
    },
    porcentaje3:  {
        type: Number,
        default:0
    },
    titulo:  {
        type: String,
        trim: true,
    },
    descripsion:  {
        type: String,
        trim: true,
    },
}
);

Informacion.method('toJSON', function(){
    const { __V, _id,...object} = this.toObject();
    object.ifid = _id;
    return object;
})

module.exports = model('Informacion', Informacion);