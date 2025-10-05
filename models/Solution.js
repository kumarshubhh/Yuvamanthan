const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  resources: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['Document', 'Video', 'Link', 'Tool']
    }
  }],
  estimatedCost: {
    type: Number,
    min: 0
  },
  estimatedTime: {
    type: String,
    enum: ['Hours', 'Days', 'Weeks', 'Months']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    text: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isAccepted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual for upvote count
solutionSchema.virtual('upvoteCount').get(function() {
  return this.upvotes.length;
});

// Virtual for downvote count
solutionSchema.virtual('downvoteCount').get(function() {
  return this.downvotes.length;
});

// Virtual for comment count
solutionSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Ensure virtual fields are serialized
solutionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Solution', solutionSchema);

