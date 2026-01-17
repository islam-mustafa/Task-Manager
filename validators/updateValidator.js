exports.updateTaskValidator = [
  body('title')
    .optional()
    .isLength({ min: 3 }).withMessage('Title too short')
    .escape(),

  body('deadline')
    .optional()
    .isISO8601().withMessage('Invalid date')
    .custom(value => {
      if (new Date(value) < new Date()) {
        throw new Error('Deadline must be in the future');
      }
      return true;
    }),

  body('completed')
    .optional()
    .isBoolean().withMessage('Completed must be boolean'),
];
