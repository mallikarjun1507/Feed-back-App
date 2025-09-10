const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');


// Admin creates user
router.post('/', authenticate, authorize(['ADMIN']), [
body('name').isLength({ min: 20, max: 60 }),
body('email').isEmail(),
body('password').matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/),
body('role').isIn(['ADMIN','USER','STORE_OWNER'])
], validate, userController.createUserByAdmin);


// list users (admin)
router.get('/', authenticate, authorize(['ADMIN']), userController.listUsers);


// get user details
router.get('/:id', authenticate, authorize(['ADMIN']), userController.getUserDetails);


// update password
router.put('/:id/password', authenticate, [ body('newPassword').matches(/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/) ], validate, userController.updatePassword);


module.exports = router;