import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const URI = process.env.MONGOURI;

async function connectWithRetry(retries = 5, delayMs = 3000) {
	if (!URI) throw new Error("MONGOURI no está definido en .env");

	const opts = {
		// Ajustes para evitar timeouts rápidos en conexiones remotas
		serverSelectionTimeoutMS: 10000,
		socketTimeoutMS: 45000,
		connectTimeoutMS: 10000,
		// Mongoose 7 ignora estas flags pero no hacen daño si están presentes
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};

	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			const conn = await mongoose.connect(URI, opts);
			console.log('Conectado a MongoDB');
			return conn;
		} catch (err) {
			console.error(`Intento ${attempt} de ${retries} falló:`, err.message);
			if (attempt === retries) throw err;
			await new Promise((r) => setTimeout(r, delayMs));
		}
	}
}

export default connectWithRetry;