const { body } = require('express-validator');

exports.createTaskValidator = [
  body('title')
    .trim()
    .escape()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title too long'),

  body('description')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 500 }),

  body('deadline')
    .optional()
    .isISO8601().withMessage('Invalid date format')
];
