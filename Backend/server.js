const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const { sequelize } = require('./src/models');


const app = express();


// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));


const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);


// routes
app.use('/api/v1/auth', require('./src/routes/auth.routes'));
app.use('/api/v1/users', require('./src/routes/user.routes'));
app.use('/api/v1/stores', require('./src/routes/store.routes'));


// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));


// error handler
app.use(require('./src/middlewares/error.middleware'));


const PORT = process.env.PORT || 4000;


async function start() {
try {
await sequelize.authenticate();
console.log('Database connected');
// sync in dev - migrations recommended for prod
await sequelize.sync();
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
} catch (err) {
console.error('Failed to start', err);
process.exit(1);
}
}


start();