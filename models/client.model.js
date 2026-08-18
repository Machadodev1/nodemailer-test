import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        maxlength: 100,
    },
    correo: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    telefono: {
        type: String,
        required: true,
    },
});

export default mongoose.models.Cliente || mongoose.model("Cliente", clienteSchema);