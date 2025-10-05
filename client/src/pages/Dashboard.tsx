import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  MapPin, 
  Calendar, 
  User, 
  ThumbsUp, 
  MessageCircle, 
  Filter,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Eye,
  Heart,
  ArrowRight
} from 'lucide-react';

interface Problem {
  _id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  priority: string;
  status: string;
  images: string[];
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

const Dashboard: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  const categories = [
    'Infrastructure', 'Environment', 'Social', 'Technology', 
    'Health', 'Education', 'Other'
  ];

  const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

  useEffect(() => {
    fetchProblems();
  }, [selectedCategory, selectedStatus, sortBy]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedStatus) params.append('status', selectedStatus);
      params.append('sortBy', sortBy);

      const response = await axios.get(`/api/problems?${params}`);
      setProblems(response.data.problems);
    } catch (error) {
      toast.error('Failed to fetch problems');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (problemId: string, voteType: 'upvote' | 'downvote' | 'remove') => {
    try {
      const response = await axios.post(`/api/problems/${problemId}/vote`, { voteType });
      
      setProblems(problems.map(problem => 
        problem._id === problemId 
          ? { 
              ...problem, 
              upvotes: response.data.upvotes,
              downvotes: response.data.downvotes,
              upvoteCount: response.data.upvoteCount,
              downvoteCount: response.data.downvoteCount
            }
          : problem
      ));
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  const filteredProblems = problems.filter(problem =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'badge-success';
      case 'In Progress': return 'badge-warning';
      case 'Resolved': return 'badge-primary';
      case 'Closed': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'badge-error';
      case 'High': return 'badge-warning';
      case 'Medium': return 'badge-primary';
      case 'Low': return 'badge-success';
      default: return 'badge-secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Community
                <span className="text-gradient"> Problems</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Discover and help solve problems in your community. Together we can make a difference.
              </p>
            </div>
            <Link
              to="/create-problem"
              className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
            >
              <Plus className="w-5 h-5" />
              <span>Post Problem</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl mb-4">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{problems.length}</div>
            <div className="text-gray-600">Total Problems</div>
          </div>
          
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-xl mb-4">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {problems.filter(p => p.status === 'Resolved').length}
            </div>
            <div className="text-gray-600">Resolved</div>
          </div>
          
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-warning-100 to-warning-200 rounded-xl mb-4">
              <Clock className="w-6 h-6 text-warning-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {problems.filter(p => p.status === 'In Progress').length}
            </div>
            <div className="text-gray-600">In Progress</div>
          </div>
          
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl mb-4">
              <Heart className="w-6 h-6 text-accent-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {problems.reduce((sum, p) => sum + p.upvoteCount, 0)}
            </div>
            <div className="text-gray-600">Total Votes</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-12"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select-field"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="lg:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="select-field"
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select-field"
              >
                <option value="createdAt">Newest First</option>
                <option value="-createdAt">Oldest First</option>
                <option value="upvoteCount">Most Upvoted</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        {filteredProblems.length === 0 ? (
          <div className="card text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6">
              <AlertCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No problems found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedCategory || selectedStatus 
                ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
                : 'Be the first to post a problem in your community and start making a difference!'
              }
            </p>
            <Link to="/create-problem" className="btn-primary">
              Post First Problem
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProblems.map((problem) => (
              <div key={problem._id} className="card-interactive group">
                {/* Problem Image */}
                {problem.images.length > 0 && (
                  <div className="mb-6 -mx-6 -mt-6">
                    <img
                      src={problem.images[0]}
                      alt={problem.title}
                      className="w-full h-48 object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Status and Priority */}
                <div className="flex justify-between items-center mb-4">
                  <span className={`badge ${getStatusColor(problem.status)}`}>
                    {problem.status}
                  </span>
                  <span className={`badge ${getPriorityColor(problem.priority)}`}>
                    {problem.priority}
                  </span>
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {problem.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                  {problem.description}
                </p>

                {/* Location */}
                <div className="flex items-center text-gray-500 text-sm mb-6">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="truncate">{problem.location}</span>
                </div>

                {/* Author and Date */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="font-medium">{problem.author.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(problem.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleVote(problem._id, 'upvote')}
                      className="flex items-center space-x-2 text-gray-600 hover:text-success-600 transition-colors group"
                    >
                      <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{problem.upvoteCount}</span>
                    </button>
                    <button
                      onClick={() => handleVote(problem._id, 'downvote')}
                      className="flex items-center space-x-2 text-gray-600 hover:text-error-600 transition-colors group"
                    >
                      <ThumbsUp className="w-4 h-4 rotate-180 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{problem.downvoteCount}</span>
                    </button>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">0</span>
                    </div>
                  </div>
                  
                  <Link
                    to={`/problems/${problem._id}`}
                    className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center space-x-1 group"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;