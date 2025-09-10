const { User, Role, Rating, Store } = require('../models');
const { hashPassword, comparePassword } = require('../utils/password.util');


async function createUserByAdmin(req, res, next) {
try {
const { name, email, password, address, role } = req.body;
const existing = await User.findOne({ where: { email } });
if (existing) return res.status(409).json({ message: 'Email already used' });
const roleRow = await Role.findOne({ where: { name: role } });
if (!roleRow) return res.status(400).json({ message: 'Invalid role' });
const password_hash = await hashPassword(password);
const user = await User.create({ name, email, password_hash, address, role_id: roleRow.id });
res.status(201).json({ id: user.id, name: user.name, email: user.email, role });
} catch (err) { next(err); }
}
async function listUsers(req, res, next) {
try {
const { page=1, limit=10, q, role, sortField='name', sortOrder='asc' } = req.query;
const offset = (page-1)*limit;
const where = {};
if (q) where[Sequelize.Op.or] = [ { name: { [Sequelize.Op.like]: `%${q}%` } }, { email: { [Sequelize.Op.like]: `%${q}%` } }, { address: { [Sequelize.Op.like]: `%${q}%` } } ];
if (role) {
const roleRow = await Role.findOne({ where: { name: role } });
if (roleRow) where.role_id = roleRow.id;
}
const users = await User.findAndCountAll({ where, limit: parseInt(limit), offset, order: [[sortField, sortOrder]], include: Role });
res.json({ data: users.rows.map(u => ({ id: u.id, name: u.name, email: u.email, address: u.address, role: u.role ? u.role.name : 'USER' })), meta: { total: users.count, page: parseInt(page), limit: parseInt(limit) } });
} catch (err) { next(err); }
}
async function getUserDetails(req, res, next) {
try {
const id = req.params.id;
const user = await User.findByPk(id, { include: Role });
if (!user) return res.status(404).json({ message: 'User not found' });
const result = { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role ? user.role.name : 'USER' };
if (result.role === 'STORE_OWNER') {
// fetch owner's store rating
const store = await Store.findOne({ where: { owner_id: user.id } });
if (store) {
const avg = await Rating.findAll({ where: { store_id: store.id }, attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']] });
result.storeRating = avg[0] && avg[0].dataValues ? parseFloat(avg[0].dataValues.avgRating || 0).toFixed(2) : '0.00';
}
}
res.json(result);
} catch (err) { next(err); }
}

async function updatePassword(req, res, next) {
try {
const id = req.params.id;
const { oldPassword, newPassword } = req.body;
if (parseInt(id) !== req.user.id && req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
const user = await User.findByPk(id);
if (!user) return res.status(404).json({ message: 'User not found' });
if (req.user.role !== 'ADMIN') {
const ok = await comparePassword(oldPassword, user.password_hash);
if (!ok) return res.status(400).json({ message: 'Old password incorrect' });
}
user.password_hash = await hashPassword(newPassword);
await user.save();
res.json({ message: 'Password updated' });
} catch (err) { next(err); }
}


module.exports = { createUserByAdmin, listUsers, getUserDetails, updatePassword };