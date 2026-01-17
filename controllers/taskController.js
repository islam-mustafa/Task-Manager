const dayjs = require('dayjs');
const Task = require('../models/taskModel');
const Notification = require('../models/notificationModel');
const { sendNotificationToUser } = require('../services/socketService');

/**
 * @desc    Create new task
 * @route   POST /api/tasks
 * @access  Private
 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    let deadlineDate;
    if (deadline) {
      deadlineDate = dayjs(deadline, 'YYYY-MM-DD HH:mm', true);

      if (!deadlineDate.isValid()) {
        return res.status(400).json({ message: 'Invalid deadline format' });
      }

      if (deadlineDate.isBefore(dayjs())) {
        return res.status(400).json({ message: 'Deadline must be in the future' });
      }
    }

        if (deadline) {
      const parsed = dayjs(deadline);
      if (parsed.isBefore(dayjs())) {
        return res.status(400).json({
          message: 'Deadline must be in the future'
        });
      }
      deadlineDate = parsed.toDate();
    }


    const task = await Task.create({
      title,
      description,
      deadline: deadlineDate ? deadlineDate.toDate() : undefined,
      completed: false, // 🔒 ممنوع المستخدم يحددها
      user: req.user._id
    });

    // 🔔 Notification (DB)
    await Notification.create({
      user: req.user._id,
      task: task._id,
      type: 'new_task',
      message: `تم إنشاء مهمة جديدة: "${task.title}"`
    });

    // 🔔 Notification (Socket)
    sendNotificationToUser(req.user._id.toString(), {
      type: 'new_task',
      message: `تمت إضافة مهمة جديدة: ${task.title}`,
      taskId: task._id
    });

    res.status(201).json(task);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all tasks (filters + pagination)
 * @route   GET /api/tasks
 * @access  Private
 */
exports.getAllTasks = async (req, res) => {
  try {
    const query = { user: req.user._id };
    const now = new Date();

    // completed filter
    if (req.query.completed === 'true') query.completed = true;
    if (req.query.completed === 'false') query.completed = false;

    // deadline filters
    if (req.query.deadlineStart || req.query.deadlineEnd) {
      query.deadline = {};
      if (req.query.deadlineStart) {
        query.deadline.$gte = new Date(req.query.deadlineStart);
      }
      if (req.query.deadlineEnd) {
        query.deadline.$lte = new Date(req.query.deadlineEnd);
      }
    }

    if (req.query.missed === 'true') {
      query.deadline = { $lt: now };
    }

    if (req.query.upcoming === 'true') {
      const threeDaysLater = new Date();
      threeDaysLater.setDate(now.getDate() + 3);
      query.deadline = { $gte: now, $lte: threeDaysLater };
    }

    // search
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      query.$or = [{ title: regex }, { description: regex }];
    }

    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const totalTasks = await Task.countDocuments(query);

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      totalTasks,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      tasks
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get task by ID
 */
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: 'Invalid task ID' });
  }
};

/**
 * @desc    Update task
 */
exports.updateTask = async (req, res) => {
  try {
    const updates = {};
    const { title, description, completed, deadline } = req.body;

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = completed;

    if (deadline) {
      const date = dayjs(deadline, 'YYYY-MM-DD HH:mm', true);

      if (!date.isValid() || date.isBefore(dayjs())) {
        return res.status(400).json({ message: 'Invalid deadline' });
      }

      updates.deadline = date.toDate();
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete task
 */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.json({ message: 'Task deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
