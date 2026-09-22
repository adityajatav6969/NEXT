import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
// import notificationRoutes from './routes/notificationRoutes.js';
import User from './models/User.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import {
  extractTokenFromSocket,
  getAllowedOrigins,
  isAllowedOrigin,
  setNoStore,
  verifyAuthToken,
} from './utils/auth.js';

dotenv.config();

mongoose.set('strictQuery', true);
mongoose.set('sanitizeFilter', true);

const app = express();
const httpServer = createServer(app);
const allowedOrigins = getAllowedOrigins();

app.disable('x-powered-by');

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400,
};

export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  maxHttpBufferSize: 1e6,
  connectTimeout: 10000,
  pingTimeout: 20000,
  pingInterval: 25000,
});

io.use(async (socket, next) => {
  try {
    const token = extractTokenFromSocket(socket);
    if (!token) {
      return next(new Error('Authentication required'));
    }

    const decoded = verifyAuthToken(token);
    const user = await User.findById(decoded.id).select('_id tokenVersion');

    if (!user) {
      return next(new Error('Authentication required'));
    }

    if ((decoded.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
      return next(new Error('Session expired'));
    }

    socket.data.userId = user._id.toString();
    return next();
  } catch {
    return next(new Error('Invalid token'));
  }
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/messages', messageRoutes);
// app.use('/api/notifications', notificationRoutes);

app.get('/api/health', async (_req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState] || 'unknown';

    setNoStore(res);

    return res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV !== 'production' && {
        uptime: process.uptime(),
        database: dbStatus,
        memory: {
          heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
          rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
        },
      }),
    });
  } catch (error) {
    return res.status(503).json({ status: 'error', message: error.message });
  }
});

app.get('/', (_req, res) => {
  res.json({ message: 'NextDevs API is running', version: '1.0.0' });
});

app.use(notFound);
app.use(errorHandler);

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 50,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('error', (error) => {
  console.error('MongoDB runtime error:', error.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting reconnect...');
});

await connectDB();

io.on('connection', (socket) => {
  const userId = socket.data.userId;
  console.log(`Client connected: ${socket.id} (user: ${userId})`);

  socket.join(userId);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  httpServer.close(() => {
    console.log('HTTP server closed');
  });

  io.close(() => {
    console.log('Socket.io closed');
  });

  try {
    await mongoose.connection.close();
    console.log('MongoDB disconnected gracefully');
  } catch (error) {
    console.error('Error closing MongoDB:', error.message);
  }

  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
