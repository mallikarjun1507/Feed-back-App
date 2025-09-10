

const { User, Role } = require('../models');
const { comparePassword, hashPassword } = require('../utils/password.util');
const { signAccessToken, signRefreshToken } = require('../utils/token.util');


async function login(req, res, next) {
try {
const { email, password } = req.body;
const user = await User.findOne({ where: { email }, include: Role });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });
const ok = await comparePassword(password, user.password_hash);
if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
const payload = { userId: user.id, role: user.role ? user.role.name : 'USER' };
const accessToken = signAccessToken(payload);
const refreshToken = signRefreshToken(payload);
res.json({ accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: payload.role } });
} catch (err) { next(err); }
}


async function register(req, res, next) {
try {
const { name, email, password, address } = req.body;
const existing = await User.findOne({ where: { email } });
if (existing) return res.status(409).json({ message: 'Email already used' });
const role = await Role.findOne({ where: { name: 'USER' } });
const password_hash = await hashPassword(password);
const user = await User.create({ name, email, password_hash, address, role_id: role.id });
res.status(201).json({ id: user.id, name: user.name, email: user.email, address: user.address });
} catch (err) { next(err); }
}


module.exports = { login, register };