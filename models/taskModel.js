const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },

    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },

    completed: {
      type: Boolean,
      default: false
    },

    deadline: {
      type: Date,
      required: false,
      validate: {
        validator: function (value) {
          // يمنع اختيار تاريخ أقل من الآن
          return value > new Date();
        },
        message: 'Deadline must be a future date'
      }
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Task', taskSchema);
