module.exports = function (err, req, res, next) {
console.error(err.stack);
const status = err.status || 500;
res.status(status).json({ status: 'error', message: err.message || 'Internal Server Error' });
};