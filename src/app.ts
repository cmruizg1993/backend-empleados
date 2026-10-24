import express from 'express';
import morgan from 'morgan';
import empleadosRoutes from './routes/empleados.routes.js';
import authRoutes from './routes/auth.routes.js';


const app = express();
app.use(express.json());
//app.use(cors());

//settings
app.set('puerto',process.env.PORT|| 3000);
app.set('nombreApp','Gestión de empleados');
app.use(morgan('dev'));
app.use('/api/v1', authRoutes);
app.use('/api/v1', empleadosRoutes);

export default app;