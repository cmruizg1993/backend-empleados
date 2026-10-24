// src/seed-usuario.ts
/**
 * Script de apoyo para sembrar un usuario de prueba en MongoDB.
 * Ejecutar una sola vez con:  npx tsx src/seed-usuario.ts
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDatabase } from './config/database.js';
import Usuario from './models/usuario.js';

const seed = async (): Promise<void> => {
  await connectDatabase();

  const username = 'admin';
  const passwordPlano = 'admin123';

  const existente = await Usuario.findOne({ username });
  if (existente) {
    console.log(`ℹ️  El usuario "${username}" ya existe, no se creó nada.`);
  } else {
    const password = await bcrypt.hash(passwordPlano, 10);
    await new Usuario({ username, password }).save();
    console.log(`✅ Usuario creado -> username: "${username}" / password: "${passwordPlano}"`);
  }

  await mongoose.disconnect();
};

seed();
