import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  MapPin, 
  Calendar, 
  User, 
  ThumbsUp, 
  MessageCircle, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  DollarSign,
  Users,
  Star
} from 'lucide-react';

interface Problem {
  _id: string;
  title: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  category: string;
  priority: string;
  status: string;
  images: string[];
  tags: string[];
  author: {
    _id: string;
    name: string;
    avatar: string;
  };
  upvotes: string[];
  downvotes: string[];
  createdAt: string;
  upvoteCount: number;
  downvoteCount: number;
}

interface Solution {
  _id: string;
  description: string;
  images: string[];
  resources: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  estimatedCost: number;
  estimatedTime: string;
  difficulty: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
  };
  upvotes: string[];
  downvotes: string[];
  comments: Array<{
    text: string;
    author: {
      _id: string;
      name: string;
      avatar: string;
    };
    createdAt: string;
  }>;
  isAccepted: boolean;
  createdAt: string;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
}

const ProblemDetail: React.FC = () => {
  const BASE_URL = 'https://yuvamanthan.onrender.com';
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const [newSolution, setNewSolution] = useState({
    description: '',
    estimatedCost: 0,
    estimatedTime: 'Days',
    difficulty: 'Medium'
  });

  useEffect(() => {
    if (id) {
      fetchProblem();
      fetchSolutions();
    }
  }, [id]);

  const fetchProblem = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/problems/${id}`);
      setProblem(response.data);
    } catch (error) {
      toast.error('Failed to fetch problem details');
    }
  };

  const fetchSolutions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/problems/${id}/solutions`);
      setSolutions(response.data.solutions);
    } catch (error) {
      toast.error('Failed to fetch solutions');
    } finally {
      setLoading(false);
    }
  };

  const handleProblemVote = async (voteType: 'upvote' | 'downvote' | 'remove') => {
    if (!problem) return;

    try {
      const response = await axios.post(`${BASE_URL}/api/problems/${problem._id}/vote`, { voteType });
      setProblem({
        ...problem,
        upvotes: response.data.upvotes,
        downvotes: response.data.downvotes,
        upvoteCount: response.data.upvoteCount,
        downvoteCount: response.data.downvoteCount
      });
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  const handleSolutionVote = async (solutionId: string, voteType: 'upvote' | 'downvote' | 'remove') => {
    try {
      const response = await axios.post(`${BASE_URL}/api/solutions/${solutionId}/vote`, { voteType });
      
      setSolutions(solutions.map(solution => 
        solution._id === solutionId 
          ? { 
              ...solution, 
              upvotes: response.data.upvotes,
              downvotes: response.data.downvotes,
              upvoteCount: response.data.upvoteCount,
              downvoteCount: response.data.downvoteCount
            }
          : solution
      ));
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  const handleSubmitSolution = async () => {
    if (!newSolution.description.trim()) {
      toast.error('Please provide a solution description');
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/solutions`, {
        ...newSolution,
        problem: id
      });
      
      toast.success('Solution submitted successfully!');
      setNewSolution({
        description: '',
        estimatedCost: 0,
        estimatedTime: 'Days',
        difficulty: 'Medium'
      });
      setShowSolutionForm(false);
      fetchSolutions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit solution');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-blue-100 text-blue-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Problem not found</h3>
        <p className="text-gray-600 mb-4">The problem you're looking for doesn't exist or has been removed.</p>
        <Link to="/dashboard" className="btn-primary">
          Back to Problems
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Problem Header */}
      <div className="card mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Images */}
          {problem.images.length > 0 && (
            <div className="lg:w-1/2">
              <div className="grid grid-cols-2 gap-2">
                {problem.images.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Problem image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Problem Info */}
          <div className="lg:w-1/2">
            <div className="flex justify-between items-start mb-4">
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(problem.status)}`}>
                  {problem.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(problem.priority)}`}>
                  {problem.priority}
                </span>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">{problem.title}</h1>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{problem.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span>Posted by {problem.author.name}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(problem.createdAt)}</span>
              </div>
            </div>

            <p className="text-gray-700 mb-6">{problem.description}</p>

            {/* Tags */}
            {problem.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {problem.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Voting */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleProblemVote('upvote')}
                className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors"
              >
                <ThumbsUp className="w-5 h-5" />
                <span>{problem.upvoteCount}</span>
              </button>
              <button
                onClick={() => handleProblemVote('downvote')}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
              >
                <ThumbsUp className="w-5 h-5 rotate-180" />
                <span>{problem.downvoteCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Solutions ({solutions.length})
          </h2>
          <button
            onClick={() => setShowSolutionForm(!showSolutionForm)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Propose Solution</span>
          </button>
        </div>

        {/* Solution Form */}
        {showSolutionForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Propose a Solution</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Solution Description *
                </label>
                <textarea
                  value={newSolution.description}
                  onChange={(e) => setNewSolution({ ...newSolution, description: e.target.value })}
                  rows={4}
                  className="input-field"
                  placeholder="Describe your solution in detail..."
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Cost ($)
                  </label>
                  <input
                    type="number"
                    value={newSolution.estimatedCost}
                    onChange={(e) => setNewSolution({ ...newSolution, estimatedCost: Number(e.target.value) })}
                    className="input-field"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Time
                  </label>
                  <select
                    value={newSolution.estimatedTime}
                    onChange={(e) => setNewSolution({ ...newSolution, estimatedTime: e.target.value })}
                    className="input-field"
                  >
                    <option value="Hours">Hours</option>
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                    <option value="Months">Months</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={newSolution.difficulty}
                    onChange={(e) => setNewSolution({ ...newSolution, difficulty: e.target.value })}
                    className="input-field"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSolutionForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitSolution}
                  className="btn-primary"
                >
                  Submit Solution
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Solutions List */}
        {solutions.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No solutions yet</h3>
            <p className="text-gray-600">Be the first to propose a solution for this problem!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {solutions.map((solution) => (
              <div key={solution._id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{solution.author.name}</p>
                      <p className="text-sm text-gray-500">{formatDate(solution.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {solution.isAccepted && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Accepted
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(solution.difficulty)}`}>
                      {solution.difficulty}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{solution.description}</p>

                {/* Solution Details */}
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  {solution.estimatedCost > 0 && (
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>${solution.estimatedCost}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{solution.estimatedTime}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span>{solution.commentCount} comments</span>
                  </div>
                </div>

                {/* Voting */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleSolutionVote(solution._id, 'upvote')}
                      className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{solution.upvoteCount}</span>
                    </button>
                    <button
                      onClick={() => handleSolutionVote(solution._id, 'downvote')}
                      className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4 rotate-180" />
                      <span>{solution.downvoteCount}</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      {solution.upvoteCount - solution.downvoteCount} points
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDetail;

