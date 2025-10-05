import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { 
  Users, 
  MapPin, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle,
  Globe,
  Heart,
  Zap,
  Sparkles,
  Star,
  Shield,
  Rocket
} from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Location-Based Problems',
      description: 'Post and discover problems in your local area with precise location mapping and GPS coordinates.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Community Solutions',
      description: 'Get creative solutions from community members who understand your local context and challenges.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Collaborative Platform',
      description: 'Work together with neighbors to solve common problems and improve your community.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Verified Solutions',
      description: 'Upvote and verify solutions that actually work in real-world scenarios.',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const stats = [
    { label: 'Problems Solved', value: '1,200+', icon: <CheckCircle className="w-6 h-6" /> },
    { label: 'Active Users', value: '5,000+', icon: <Users className="w-6 h-6" /> },
    { label: 'Cities Covered', value: '150+', icon: <MapPin className="w-6 h-6" /> },
    { label: 'Success Rate', value: '85%', icon: <Star className="w-6 h-6" /> }
  ];

  const steps = [
    {
      number: '01',
      title: 'Post a Problem',
      description: 'Share a problem you\'ve noticed in your community with photos and location details.',
      icon: <MapPin className="w-6 h-6" />
    },
    {
      number: '02',
      title: 'Get Solutions',
      description: 'Community members propose creative solutions and share their expertise.',
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      number: '03',
      title: 'Take Action',
      description: 'Collaborate with others to implement the best solutions and track progress.',
      icon: <Rocket className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent"></div>
        {/* Decorative background image mesh */}
        <div 
          className="absolute -right-20 -top-20 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="relative container-custom section-padding">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Join the Community Revolution</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 animate-slide-up text-balance">
              Solve Problems
              <span className="block text-transparent bg-gradient-to-r from-white to-blue-200 bg-clip-text">
                Together
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto animate-slide-up text-pretty">
              Join CrowdSolve and connect with your community to identify, discuss, and solve local problems collaboratively. 
              Make a real difference in your neighborhood.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-bounce-in">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <Link to="/login" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4">
                    Sign In
                  </Link>
                </>
              )}
            </div>

            <div className="mt-16 flex items-center justify-center space-x-8 text-blue-200">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                <span className="text-sm">Secure & Private</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                <span className="text-sm">Fast & Reliable</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                <span className="text-sm">Community Driven</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-primary-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container-custom">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 mb-6">
              <Star className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">Why Choose CrowdSolve</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-balance">
              Powerful Features for
              <span className="text-gradient"> Community Impact</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
              Our platform makes it easy to identify problems, propose solutions, and track progress in your community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="card-hover h-full">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-pretty">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-success-100 text-success-700 mb-6">
              <Rocket className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">Simple Process</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-balance">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-pretty">
              Get started in minutes and make a real difference in your community.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              {steps.map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl group-hover:scale-110 transition-transform duration-300">
                      <div className="text-primary-600">
                        {step.icon}
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-pretty">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent"></div>
        
        <div className="relative container-custom text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-balance">
              Ready to Make a
              <span className="block text-transparent bg-gradient-to-r from-white to-blue-200 bg-clip-text">
                Difference?
              </span>
            </h2>
            <p className="text-xl lg:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto text-pretty">
              Join thousands of community members who are already solving problems and improving their neighborhoods.
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
                  Start Solving Problems Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/login" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">CrowdSolve</span>
              </div>
              <p className="text-gray-400 text-pretty mb-6">
                Empowering communities to solve problems together through collaboration and innovation.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Zap className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-6">Platform</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Problems</Link></li>
                <li><Link to="/create-problem" className="hover:text-white transition-colors">Post Problem</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Solutions</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-6">Account</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/profile" className="hover:text-white transition-colors">Profile</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-6">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CrowdSolve. All rights reserved. Made with ❤️ for communities worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;