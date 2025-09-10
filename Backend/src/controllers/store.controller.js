const { Store, Rating, User, sequelize } = require('../models');

async function createStore(req, res, next) {
  try {
    const { name, email, address, ownerId } = req.body;
    const store = await Store.create({ 
      name, 
      email, 
      address, 
      owner_id: ownerId || null 
    });
    res.status(201).json(store);
  } catch (err) {
    next(err);
  }
}

async function listStores(req, res, next) {
  try {
    const userId = req.user?.id || 0; 
    const { page = 1, limit = 10, name, address, sortField = 'avgRating', sortOrder = 'desc' } = req.query;
    const offset = (page - 1) * limit;

    const replacements = { limit: parseInt(limit), offset: parseInt(offset), userId };
    let whereClause = 'WHERE 1=1';
    if (name) { 
      whereClause += ' AND s.name LIKE :name'; 
      replacements.name = `%${name}%`; 
    }
    if (address) { 
      whereClause += ' AND s.address LIKE :address'; 
      replacements.address = `%${address}%`; 
    }

    const sql = `
      SELECT s.id, s.name, s.email, s.address,
             IFNULL(ROUND(AVG(r.rating),2),0) AS avgRating,
             COUNT(DISTINCT r.id) AS totalRatings,
             ur.rating AS userRating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = :userId
      ${whereClause}
      GROUP BY s.id
      ORDER BY ${sortField === 'name' ? 's.name' : 'avgRating'} ${sortOrder === 'asc' ? 'ASC' : 'DESC'}
      LIMIT :limit OFFSET :offset
    `;

    const [rows] = await sequelize.query(sql, { replacements });
    res.json({ data: rows, meta: { page: parseInt(page), limit: parseInt(limit) } });

  } catch (err) {
    next(err);
  }
}

async function getStoreRatings(req, res, next) {
  try {
    const { storeId } = req.params;
    const ratings = await Rating.findAll({
      where: { store_id: storeId },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['created_at', 'DESC']]
    });
    res.json(ratings);
  } catch (err) {
    next(err);
  }
}

module.exports = { createStore, listStores, getStoreRatings };
