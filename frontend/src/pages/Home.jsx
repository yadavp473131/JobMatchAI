import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Search, MapPin, CheckCircle, Star, ArrowRight, Sparkles, Target, BarChart3, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import api from '../services/api';
import JobCard from '../components/jobs/JobCard';

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/jobs?limit=6');
      setFeaturedJobs(response.data.data.jobs || []);
    } catch (error) {
      console.error('Error fetching featured jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar user={user} onLogout={logout} />

      {/* Hero Section - Consistent py-24 */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-accent-700 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                {/* Badge - Consistent spacing */}
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
                  <span className="bg-success-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">NEW</span>
                  <span className="text-sm font-medium">AI Resume Analyzer is here →</span>
                </div>

                {/* Heading - Consistent text-5xl */}
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  Find Your Dream Job with{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-success-400 to-accent-300">
                    AI-Powered
                  </span>{' '}
                  Matching
                </h1>

                {/* Subheading - Consistent text-xl, neutral-100 */}
                <p className="text-xl text-primary-100 mb-8 leading-relaxed max-w-2xl">
                  Simplify your job search with our user-friendly platform that enhances your overall efficiency through intelligent matching.
                </p>

                {/* CTA Buttons - Consistent spacing */}
                <div className="flex flex-wrap gap-4 mb-12">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 bg-success-500 hover:bg-success-600 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Get Started
                    <ArrowRight size={20} />
                  </Link>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all border border-white/20"
                  >
                    Browse Jobs
                  </Link>
                </div>

                {/* Trust Indicators - Consistent text-sm */}
                <div className="flex flex-wrap items-center gap-8 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-success-400" size={20} />
                    <span>10,000+ Active Jobs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-success-400" size={20} />
                    <span>5,000+ Companies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-success-400" size={20} />
                    <span>95% Success Rate</span>
                  </div>
                </div>
              </div>

              {/* Right Illustration */}
              <div className="hidden lg:block">
                <div className="relative">
                  {/* Floating notification */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-2xl p-4 animate-bounce z-10">
                    <div className="flex items-center gap-3">
                      <div className="bg-success-100 p-3 rounded-xl">
                        <CheckCircle className="text-success-600" size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">Application Sent!</p>
                        <p className="text-xs text-neutral-500">Senior Developer</p>
                      </div>
                    </div>
                  </div>

                  {/* Main card */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                    <div className="bg-gradient-to-br from-accent-500 to-primary-600 rounded-2xl p-6 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-white/80 text-sm font-medium">Match Score</span>
                        <Sparkles className="text-success-400" size={20} />
                      </div>
                      <div className="text-5xl font-bold text-white mb-2">94%</div>
                      <p className="text-white/80 text-sm">Perfect match for your profile</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-success-400 to-success-600 rounded-xl flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate">Senior React Developer</p>
                            <p className="text-white/60 text-sm">Tech Corp • Remote</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate">Full Stack Engineer</p>
                            <p className="text-white/60 text-sm">StartupXYZ • Hybrid</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section - Light blue gradient */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Section Header - Consistent spacing */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-neutral-900 mb-4">Start Your Job Search</h2>
              <p className="text-xl text-neutral-600">Discover opportunities tailored to your skills and experience</p>
            </div>

            {/* Search Form - Consistent p-8 */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">Job Title or Keywords</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                    <input
                      type="text"
                      placeholder="e.g. Software Engineer"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 text-base border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                    <input
                      type="text"
                      placeholder="City, state, or remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 text-base border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-success-500 hover:bg-success-600 text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Search Jobs
                  </button>
                </div>
              </div>

              {/* Popular Tags - Consistent spacing */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-neutral-500">Popular:</span>
                {['Remote', 'Full-time', 'Senior Level', 'Tech'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* How It Works - Light blue gradient */}
      <section className="py-24 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-neutral-900 mb-4">How It Works</h2>
              <p className="text-xl text-neutral-600">Get hired in 3 simple steps</p>
            </div>

            {/* Steps Grid - Consistent gap-8 */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-primary-100 h-full">
                  <div className="bg-primary-900 text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold mb-6">
                    1
                  </div>
                  <div className="bg-primary-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Users className="text-primary-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">Create Profile</h3>
                  <p className="text-base text-neutral-600 leading-relaxed">
                    Sign up and build your professional profile. Our AI extracts your skills and experience automatically.
                  </p>
                </div>
                {/* Connector line */}
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary-200 to-transparent"></div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-accent-50 to-success-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-accent-100 h-full">
                  <div className="bg-accent-500 text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold mb-6">
                    2
                  </div>
                  <div className="bg-accent-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Sparkles className="text-accent-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">AI Matches Jobs</h3>
                  <p className="text-base text-neutral-600 leading-relaxed">
                    Our intelligent algorithm analyzes your profile and matches you with perfect opportunities.
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-accent-200 to-transparent"></div>
              </div>

              {/* Step 3 */}
              <div className="group">
                <div className="bg-gradient-to-br from-success-50 to-primary-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-success-100 h-full">
                  <div className="bg-success-500 text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold mb-6">
                    3
                  </div>
                  <div className="bg-success-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <CheckCircle className="text-success-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">Apply Instantly</h3>
                  <p className="text-base text-neutral-600 leading-relaxed">
                    Apply with one click and track your applications. Get notified when employers review your profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose - Consistent py-24 */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-neutral-900 mb-4">Why Choose JobMatchAI?</h2>
              <p className="text-xl text-neutral-600">Powered by cutting-edge AI technology</p>
            </div>

            {/* Features Grid - Consistent gap-8, p-8 */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all h-full">
                <div className="bg-gradient-to-br from-accent-500 to-primary-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Sparkles className="text-white" size={28} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-3">AI Resume Analyzer</h3>
                <p className="text-base text-neutral-600 leading-relaxed">
                  Automatically extract skills, experience, and qualifications from your resume.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all h-full">
                <div className="bg-gradient-to-br from-success-500 to-accent-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Target className="text-white" size={28} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-3">Skill Gap Detection</h3>
                <p className="text-base text-neutral-600 leading-relaxed">
                  Identify missing skills and get personalized learning recommendations.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all h-full">
                <div className="bg-gradient-to-br from-primary-500 to-accent-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="text-white" size={28} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-3">Smart Matching Score</h3>
                <p className="text-base text-neutral-600 leading-relaxed">
                  See your compatibility with each job posting with our AI-powered match score.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all h-full">
                <div className="bg-gradient-to-br from-accent-500 to-success-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="text-white" size={28} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-3">Career Recommendations</h3>
                <p className="text-base text-neutral-600 leading-relaxed">
                  Get AI-driven insights on career paths and growth opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs - Consistent py-24 */}
      <section className="py-24 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12 gap-4">
              <div>
                <h2 className="text-4xl font-bold text-neutral-900 mb-2">Featured Opportunities</h2>
                <p className="text-xl text-neutral-600">Explore the latest openings from top companies</p>
              </div>
              <Link
                to="/jobs"
                className="hidden md:inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-base transition-colors"
              >
                View All Jobs
                <ArrowRight size={20} />
              </Link>
            </div>

            {/* Jobs Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                  {featuredJobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>

                <div className="text-center md:hidden">
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
                  >
                    View All Jobs
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials - Consistent py-24 */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-neutral-900 mb-4">What Our Users Say</h2>
              <p className="text-xl text-neutral-600">Join thousands of satisfied job seekers and employers</p>
            </div>

            {/* Testimonials Grid - Consistent gap-8, p-8 */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah Johnson',
                  role: 'Software Engineer',
                  company: 'Tech Corp',
                  text: 'JobMatchAI helped me find my dream job in just 2 weeks! The AI matching is incredibly accurate.',
                  rating: 5,
                },
                {
                  name: 'Michael Chen',
                  role: 'HR Manager',
                  company: 'StartupXYZ',
                  text: 'As an employer, this platform has saved us countless hours. The candidate recommendations are spot-on.',
                  rating: 5,
                },
                {
                  name: 'Emily Rodriguez',
                  role: 'Product Designer',
                  company: 'Design Studio',
                  text: 'The resume analyzer feature is a game-changer. It highlighted skills I didn\'t even know were valuable.',
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all h-full flex flex-col">
                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-current" size={20} />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-base text-neutral-600 mb-6 leading-relaxed flex-grow">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 text-base">{testimonial.name}</p>
                      <p className="text-sm text-neutral-500">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Consistent py-24 */}
      <section className="py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-accent-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-xl text-primary-100 mb-10 leading-relaxed">
              Join thousands of professionals who have found their dream jobs with JobMatchAI
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-success-500 hover:bg-success-600 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Get Started Free
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all border border-white/20"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
