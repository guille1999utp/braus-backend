const {Schema,model} = require('mongoose');
const userCreateSchema = new Schema({
    usuario:  {
        type: String,
        required : true,
        trim: true,
    }, 
    referido:  {
        type: String,
        trim: true,
    }, 
    Creado:  {
        type: Boolean,
        trim: true,
        default:false
    },
}
);

userCreateSchema.method('toJSON', function(){
    const { __V, _id,...object} = this.toObject();
    object.ucid = _id;
    return object;
})

module.exports = model('UserCreate', userCreateSchema);