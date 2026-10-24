import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('Falta configurar la variable de entorno MONGO_URI');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('[Database] Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('[Database] Error al conectar con MongoDB:', error);
    process.exit(1);
  }
};
