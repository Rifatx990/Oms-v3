const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validationMiddleware = require('../middleware/validation.middleware');
const { check } = require('express-validator');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Validation rules
const orderValidation = [
  check('customerName').notEmpty().withMessage('Customer name is required'),
  check('phone').notEmpty().withMessage('Phone number is required'),
  check('itemName').notEmpty().withMessage('Item name is required'),
  check('totalAmount').isNumeric().withMessage('Total amount must be a number'),
  check('advancePaid').isNumeric().withMessage('Advance paid must be a number')
];

// Routes
router.post('/', orderValidation, validationMiddleware, orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/stats', orderController.getOrderStats);
router.get('/:id', orderController.getOrderById);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);
router.post('/:id/payment', orderController.addPayment);

module.exports = router;
