const { Rating, User } = require('../models');

// Unified submitRating for POST (create) and PUT (update)
async function submitRating(req, res) {
  try {
    const { storeId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;
    const role = req.user?.role?.toUpperCase();

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Restrict store owners from adding/updating ratings
    if (role === 'STORE_OWNER') {
      return res.status(403).json({ message: 'Store owners cannot add or edit ratings' });
    }

    // Admin can update any rating for the store
    const whereClause = role === 'ADMIN' 
      ? { store_id: storeId } 
      : { store_id: storeId, user_id: userId };

    // Check if rating already exists
    let existing = await Rating.findOne({ where: whereClause });

    if (existing) {
      existing.rating = rating;
      existing.comment = comment ?? existing.comment;
      await existing.save();

      const updated = await Rating.findByPk(existing.id, {
        include: [{ model: User, attributes: ['id', 'name', 'email'] }]
      });

      return res.status(200).json({
        message: 'Rating updated successfully',
        data: updated
      });
    }

    // Create new rating (USER only, Admin can also create for testing)
    const newRating = await Rating.create({
      user_id: userId,
      store_id: storeId,
      rating,
      comment: comment || null
    });

    const created = await Rating.findByPk(newRating.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    return res.status(201).json({
      message: 'Rating submitted successfully',
      data: created
    });

  } catch (err) {
    console.error('ERROR in submitRating:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Get all ratings for a store
async function getStoreRatings(req, res) {
  try {
    const { storeId } = req.params;
    const { page = 1, limit = 10, sortField = 'created_at', sortOrder = 'DESC' } = req.query;

    const offset = (page - 1) * limit;

    const { rows, count } = await Rating.findAndCountAll({
      where: { store_id: storeId },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [[sortField, sortOrder]],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    return res.status(200).json({
      data: rows,
      meta: { page: parseInt(page, 10), limit: parseInt(limit, 10), total: count }
    });

  } catch (err) {
    console.error('ERROR in getStoreRatings:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { submitRating, getStoreRatings };
