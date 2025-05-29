require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo'); 
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const animalRoutes = require('./routes/animalRoutes');

const app = express();
app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "cdn.jsdelivr.net"
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "fonts.googleapis.com"
        ],
        fontSrc: [
          "'self'",
          "fonts.gstatic.com"
        ],
        imgSrc: [
          "'self'",
          "data:"
        ],
        connectSrc: [
          "'self'",
          "http://localhost:4200",  
        ],
        objectSrc: ["'none'"],
        frameAncestors: ["'self'"],
        baseUri: ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
  })
);


app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const requestPath = (req.path || '').toLowerCase();

  const blockedPaths = [
    'wp-includes', 'xmlrpc.php', 'wlwmanifest', 'wp-admin',
    'wp-content', 'wp-login.php', 'administrator', '.env',
    'config.php', 'xmlrpc', 'wp-json'
  ];

  if (blockedPaths.some(blocked => requestPath.includes(blocked))) {
    return res.status(403).send('Acesso negado');
  }

  const blockedUserAgents = ['sqlmap', 'nikto', 'acunetix', 'wpscan'];

  if (blockedUserAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    console.log(`🚫 Bloqueado user-agent suspeito: ${userAgent}`);
    return res.status(403).send('Acesso não autorizado');
  }

  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições deste IP, tente novamente mais tarde'
});
app.use(limiter);

console.log(process.env.MONGO_URL);

app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo-super-secreto',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: `${process.env.MONGO_URL}` || 'mongodb://admin:pet2187@mongodb:27017/dbpet?authSource=admin',
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'native'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 14 * 24 * 60 * 60 * 1000 
  }
}));
app.use(flash());

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
  skip: (req) => req.path.startsWith('/healthcheck')
}));

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Não autorizado pelo CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb', parameterLimit: 100 }));


const mongoOptions = {
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true,
  w: 'majority',
  appName: 'alerta-pet'
};

mongoose.connect(process.env.MONGO_URL || 'mongodb://mongodb:27017/dbpet', mongoOptions)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => {
    console.error('❌ Erro MongoDB:', err);
    if (process.env.NODE_ENV === 'production') process.exit(1);
  });

app.get('/healthcheck', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);

app.get('/', (req, res) => {
  res.send('Api está em execução...');
});


app.use((err, req, res, next) => {
  console.error('🔥 Erro:', err.stack);
  res.status(err.status || 500).render('errors/error', {
    title: 'Erro',
    error: {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    },
    env: process.env.NODE_ENV
  });
});


const PORT = process.env.APP_PORT || 4501;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🔗 Modo: ${process.env.NODE_ENV || 'development'}`);
});

const shutdown = (signal) => {
  console.log(`🛑 Recebido ${signal}. Encerrando servidor...`);
  server.close(() => {
    mongoose.connection.close(false).then(() => {
      console.log('⏹️ Conexões encerradas. Servidor desligado.');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
