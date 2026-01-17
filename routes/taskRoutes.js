const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { createTaskValidator } = require('../validators/taskValidator');
const validate = require('../middleware/validate');


router.use(auth); // Protect all routes below

router.post('/', createTaskValidator, validate,taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', createTaskValidator,validate,taskController.updateTask);
router.delete('/:id', taskController.deleteTask);   

module.exports = router;
