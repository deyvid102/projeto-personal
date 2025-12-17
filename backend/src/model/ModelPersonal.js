import mongoose from "mongoose";

const CadPersonalSchema = new mongoose.Schema({

     nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    sexo: {
        type: String,
        enum: ["M", "F", ""],
        default: ""
    },
    status: {
        type: String,
        enum: ['A', 'C', 'S'],
    },

});

export default mongoose.model('Personal', CadPersonalSchema);


// const PersonalSchema = new mongoose.Schema({
//   usuarioId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Usuario",
//     required: true,
//     unique: true
//   },

//   sexo: {
//     type: String,
//     enum: ["M", "F"]
//   },

//   status: {
//     type: String,
//     enum: ["A", "C", "S"],
//     default: "A"
//   }

// }, { timestamps: true });

// export default mongoose.model("Personal", PersonalSchema);
