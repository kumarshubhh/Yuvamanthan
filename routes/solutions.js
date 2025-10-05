const express = require('express');
const { body, validationResult } = require('express-validator');
const Solution = require('../models/Solution');
const Problem = require('../models/Problem');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/solutions
// @desc    Get all solutions
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, problemId, sortBy = 'createdAt' } = req.query;
    
    const query = {};
    if (problemId) query.problem = problemId;

    const solutions = await Solution.find(query)
      .populate('author', 'name avatar')
      .populate('problem', 'title')
      .populate('upvotes', 'name')
      .populate('downvotes', 'name')
      .populate('comments.author', 'name avatar')
      .sort({ [sortBy]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Solution.countDocuments(query);

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

// @route   GET /api/solutions/:id
// @desc    Get single solution
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('problem', 'title description')
      .populate('upvotes', 'name')
      .populate('downvotes', 'name')
      .populate('comments.author', 'name avatar');

    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }

    res.json(solution);
  } catch (error) {
    console.error('Get solution error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/solutions
// @desc    Create new solution
// @access  Private
router.post('/', auth, [
  body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('problem').isMongoId().withMessage('Valid problem ID is required'),
  body('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']).withMessage('Valid difficulty is required'),
  body('estimatedCost').optional().isNumeric().withMessage('Estimated cost must be a number'),
  body('estimatedTime').optional().isIn(['Hours', 'Days', 'Weeks', 'Months']).withMessage('Valid estimated time is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      description,
      images,
      resources,
      estimatedCost,
      estimatedTime,
      difficulty,
      problem
    } = req.body;

    // Check if problem exists
    const problemExists = await Problem.findById(problem);
    if (!problemExists) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const solution = new Solution({
      description,
      images: images || [],
      resources: resources || [],
      estimatedCost: estimatedCost || 0,
      estimatedTime: estimatedTime || 'Days',
      difficulty: difficulty || 'Medium',
      problem,
      author: req.user._id
    });

    await solution.save();
    await solution.populate('author', 'name avatar');
    await solution.populate('problem', 'title');

    res.status(201).json(solution);
  } catch (error) {
    console.error('Create solution error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/solutions/:id
// @desc    Update solution
// @access  Private
router.put('/:id', auth, [
  body('description').optional().trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']).withMessage('Valid difficulty is required'),
  body('estimatedCost').optional().isNumeric().withMessage('Estimated cost must be a number'),
  body('estimatedTime').optional().isIn(['Hours', 'Days', 'Weeks', 'Months']).withMessage('Valid estimated time is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const solution = await Solution.findById(req.params.id);
    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }

    // Check if user is the author
    if (solution.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this solution' });
    }

    const updateFields = {};
    if (req.body.description) updateFields.description = req.body.description;
    if (req.body.images) updateFields.images = req.body.images;
    if (req.body.resources) updateFields.resources = req.body.resources;
    if (req.body.estimatedCost !== undefined) updateFields.estimatedCost = req.body.estimatedCost;
    if (req.body.estimatedTime) updateFields.estimatedTime = req.body.estimatedTime;
    if (req.body.difficulty) updateFields.difficulty = req.body.difficulty;

    const updatedSolution = await Solution.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    )
    .populate('author', 'name avatar')
    .populate('problem', 'title');

    res.json(updatedSolution);
  } catch (error) {
    console.error('Update solution error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/solutions/:id
// @desc    Delete solution
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }

    // Check if user is the author
    if (solution.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this solution' });
    }

    await Solution.findByIdAndDelete(req.params.id);

    res.json({ message: 'Solution deleted successfully' });
  } catch (error) {
    console.error('Delete solution error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/solutions/:id/vote
// @desc    Vote on solution
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
    const solution = await Solution.findById(req.params.id);
    
    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }

    const userId = req.user._id;

    // Remove existing votes
    solution.upvotes = solution.upvotes.filter(id => id.toString() !== userId.toString());
    solution.downvotes = solution.downvotes.filter(id => id.toString() !== userId.toString());

    // Add new vote
    if (voteType === 'upvote') {
      solution.upvotes.push(userId);
    } else if (voteType === 'downvote') {
      solution.downvotes.push(userId);
    }

    await solution.save();
    await solution.populate('upvotes', 'name');
    await solution.populate('downvotes', 'name');

    res.json({
      upvotes: solution.upvotes,
      downvotes: solution.downvotes,
      upvoteCount: solution.upvoteCount,
      downvoteCount: solution.downvoteCount
    });
  } catch (error) {
    console.error('Vote solution error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/solutions/:id/comments
// @desc    Add comment to solution
// @access  Private
router.post('/:id/comments', auth, [
  body('text').trim().isLength({ min: 1 }).withMessage('Comment text is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;
    const solution = await Solution.findById(req.params.id);
    
    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }

    const comment = {
      text,
      author: req.user._id
    };

    solution.comments.push(comment);
    await solution.save();
    await solution.populate('comments.author', 'name avatar');

    const newComment = solution.comments[solution.comments.length - 1];
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/solutions/:id/accept
// @desc    Accept solution (only problem author can do this)
// @access  Private
router.put('/:id/accept', auth, async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id)
      .populate('problem');
    
    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' });
    }

    // Check if user is the problem author
    if (solution.problem.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the problem author can accept solutions' });
    }

    // Unaccept all other solutions for this problem
    await Solution.updateMany(
      { problem: solution.problem._id, _id: { $ne: solution._id } },
      { isAccepted: false }
    );

    // Accept this solution
    solution.isAccepted = true;
    await solution.save();

    res.json({ message: 'Solution accepted successfully', solution });
  } catch (error) {
    console.error('Accept solution error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

