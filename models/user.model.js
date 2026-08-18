import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    correo: {
        type: String,
        required: true,
        maxlength: 100,
    },
    contra: {
        type: String,
        required: true,
        maxlength: 150,
    },
    rol: {
        type: String,
        enum: ["Admin", "Empleado"],
        default: "Empleado",
    },
}, {
    timestamps: true,
});

export default mongoose.models.Usuarios || mongoose.model("Usuarios", usuarioSchema);