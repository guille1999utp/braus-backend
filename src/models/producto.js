const {Schema,model} = require('mongoose');
const puroductoSchema = new Schema({
    titulo:  {
        type: String,
        required : true,
        trim: true,
    },
    fotosdescripsion:  {
        type: String,
        required : true,
        trim: true,
    },
    fotosId:  {
        type: String,
        required : true,
        trim: true,
    },
    precio:  {
        type: Number,
        required : true,
        default:0
    },
    creacion : {
        type: Date,
        default: Date.now
    }}
);

puroductoSchema.method('toJSON', function(){
    const { __V, _id, ...object} = this.toObject();
    object.pid = _id;
    return object;
})

module.exports = model('Producto', puroductoSchema);