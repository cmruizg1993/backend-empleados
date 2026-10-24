import { Schema, model } from 'mongoose';

const usuarioSchema = new Schema({

 username:{type:String, required:true, unique:true},
 password:{type:String, required:true}
}, {    
     timestamps:true,
 versionKey:false
});

export default model("Usuario", usuarioSchema);
