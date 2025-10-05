const express = require('express');
const { body, validationResult } = require('express-validator');
const Problem = require('../models/Problem');
const Solution = require('../models/Solution');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/problems
// @desc    Get all problems
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, sortBy = 'createdAt' } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const problems = await Problem.find(query)
      .populate('author', 'name avatar')
      .sort({ [sortBy]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Problem.countDocuments(query);

    res.json({
      problems,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/problems/:id
// @desc    Get single problem
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate('author', 'name avatar location')
      .populate('upvotes', 'name')
      .populate('downvotes', 'name');

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json(problem);
  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/problems
// @desc    Create new problem
// @access  Private
router.post('/', auth, [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('coordinates.lat').isNumeric().withMessage('Valid latitude is required'),
  body('coordinates.lng').isNumeric().withMessage('Valid longitude is required'),
  body('category').isIn(['Infrastructure', 'Environment', 'Social', 'Technology', 'Health', 'Education', 'Other']).withMessage('Valid category is required'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      location,
      coordinates,
      images,
      category,
      priority,
      tags
    } = req.body;

    const problem = new Problem({
      title,
      description,
      location,
      coordinates,
      images,
      category,
      priority: priority || 'Medium',
      tags: tags || [],
      author: req.user._id
    });

    await problem.save();
    await problem.populate('author', 'name avatar');

    res.status(201).json(problem);
  } catch (error) {
    console.error('Create problem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/problems/:id
// @desc    Update problem
// @access  Private
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').optional().trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('status').optional().isIn(['Open', 'In Progress', 'Resolved', 'Closed']).withMessage('Valid status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Check if user is the author
    if (problem.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this problem' });
    }

    const updateFields = {};
    if (req.body.title) updateFields.title = req.body.title;
    if (req.body.description) updateFields.description = req.body.description;
    if (req.body.status) updateFields.status = req.body.status;
    if (req.body.priority) updateFields.priority = req.body.priority;
    if (req.body.tags) updateFields.tags = req.body.tags;

    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');

    res.json(updatedProblem);
  } catch (error) {
    console.error('Update problem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/problems/:id
// @desc    Delete problem
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Check if user is the author
    if (problem.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this problem' });
    }

    // Delete associated solutions
    await Solution.deleteMany({ problem: req.params.id });

    await Problem.findByIdAndDelete(req.params.id);

    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    console.error('Delete problem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/problems/:id/vote
// @desc    Vote on problem
// @access  Private
router.post('/:id/vote', auth, [
  body('voteType').isIn(['upvote', 'downvote', 'remove']).withMessage('Valid vote type is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { voteType } = req.body;
    const problem = await Problem.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const userId = req.user._id;

    // Remove existing votes
    problem.upvotes = problem.upvotes.filter(id => id.toString() !== userId.toString());
    problem.downvotes = problem.downvotes.filter(id => id.toString() !== userId.toString());

    // Add new vote
    if (voteType === 'upvote') {
      problem.upvotes.push(userId);
    } else if (voteType === 'downvote') {
      problem.downvotes.push(userId);
    }

    await problem.save();
    await problem.populate('upvotes', 'name');
    await problem.populate('downvotes', 'name');

    res.json({
      upvotes: problem.upvotes,
      downvotes: problem.downvotes,
      upvoteCount: problem.upvoteCount,
      downvoteCount: problem.downvoteCount
    });
  } catch (error) {
    console.error('Vote problem error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/problems/:id/solutions
// @desc    Get solutions for a problem
// @access  Public
router.get('/:id/solutions', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt' } = req.query;

    const solutions = await Solution.find({ problem: req.params.id })
      .populate('author', 'name avatar')
      .populate('upvotes', 'name')
      .populate('downvotes', 'name')
      .populate('comments.author', 'name avatar')
      .sort({ [sortBy]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Solution.countDocuments({ problem: req.params.id });

    res.json({
      solutions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get solutions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

