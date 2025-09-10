const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

// Configure Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || 'feedback_app',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Root',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, 
  }
);

// Import models from src/models
const RoleModel = require('./src/models/role.model')(sequelize, DataTypes);
const UserModel = require('./src/models/user.model')(sequelize, DataTypes);
const StoreModel = require('./src/models/store.model')(sequelize, DataTypes);
const RatingModel = require('./src/models/rating.model')(sequelize, DataTypes);

// Attach associations
const models = { Role: RoleModel, User: UserModel, Store: StoreModel, Rating: RatingModel };
Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

// Helper to hash password
const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

// Sync and Seed
(async () => {
  try {
    await sequelize.authenticate();
    console.log(' Database connection established.');

    await sequelize.sync({ force: true }); 
    console.log('All tables synced successfully.');

    // ---- Seed Roles ----
    const [adminRole] = await RoleModel.findOrCreate({ where: { name: 'ADMIN' } });
    const [userRole] = await RoleModel.findOrCreate({ where: { name: 'USER' } });
    const [storeOwnerRole] = await RoleModel.findOrCreate({ where: { name: 'STORE_OWNER' } });

    console.log('Roles seeded successfully.');

    // ---- Seed Admin ----
    const admin = await UserModel.create({
      name: 'Darshan',
      email: 'darshan@example.com',
      password_hash: await hashPassword('darshan123'),
      role_id: adminRole.id,
    });

    console.log('Admin created.');

    // ---- Seed Store Owners ----
    const owner1 = await UserModel.create({
      name: 'Akash',
      email: 'akash@example.com',
      password_hash: await hashPassword('akash123'),
      role_id: storeOwnerRole.id,
    });

    const owner2 = await UserModel.create({
      name: 'Madhu',
      email: 'madhu@example.com',
      password_hash: await hashPassword('madhu123'),
      role_id: storeOwnerRole.id,
    });

    const owner3 = await UserModel.create({
      name: 'Kaveri',
      email: 'kaveri@example.com',
      password_hash: await hashPassword('kaveri123'),
      role_id: storeOwnerRole.id,
    });

    console.log(' Store Owners created.');

    // ---- Seed Stores ----
    const storeA = await StoreModel.create({
      name: 'KFC',
      email: 'kfc@example.com',
      address: 'Majestic',
      owner_id: owner1.id,
    });

    const storeB = await StoreModel.create({
      name: 'Burger King',
      email: 'bk@example.com',
      address: 'Jayanagar',
      owner_id: owner2.id,
    });

    const storeC = await StoreModel.create({
      name: 'Dominos',
      email: 'dominos@example.com',
      address: 'Vijayanagar',
      owner_id: owner3.id,
    });

    console.log(' Stores created.');

    // ---- Seed Normal Users ----
    const user1 = await UserModel.create({
      name: 'Arjun',
      email: 'arjun@example.com',
      password_hash: await hashPassword('arjun123'),
      role_id: userRole.id,
    });

    const user2 = await UserModel.create({
      name: 'Mahesh',
      email: 'mahesh@example.com',
      password_hash: await hashPassword('mahesh123'),
      role_id: userRole.id,
    });

    const user3 = await UserModel.create({
      name: 'Ramesh',
      email: 'ramesh@example.com',
      password_hash: await hashPassword('ramesh123'),
      role_id: userRole.id,
    });

    console.log('Users created.');

    // ---- Seed Ratings ----
    await RatingModel.bulkCreate([
      { user_id: user1.id, store_id: storeA.id, rating: 4, comment: 'Great food and fast service!' },
      { user_id: user2.id, store_id: storeA.id, rating: 5, comment: 'Loved the crispy chicken!' },
      { user_id: user3.id, store_id: storeB.id, rating: 3, comment: 'Burger was okay, fries could be better.' },
      { user_id: user1.id, store_id: storeC.id, rating: 5, comment: 'Best pizza in town!' },
    ]);

    console.log(' Ratings inserted.');

    console.log(' Seed data (roles, admin, owners, stores, users, ratings) inserted successfully.');
    process.exit(0);
  } catch (err) {
    console.error(' Error syncing database:', err);
    process.exit(1);
  }
})();
