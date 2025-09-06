import React, { useState, useEffect } from 'react';
import { Search, Clock, ExternalLink, Sparkles, Brain, Zap, RefreshCw, TrendingUp, Globe, Calendar, ArrowUpRight } from 'lucide-react';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { useInView } from 'react-intersection-observer';
import NewsCard from '../components/NewsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { fetchNews } from '../services/api';

const LandingPage = () => {
  const [lastUpdate, setLastUpdate] = useState(null);
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();

  // Infinite query for news
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
    isRefetching
  } = useInfiniteQuery(
    'news',
    ({ pageParam = 1 }) => fetchNews(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.has_more ? lastPage.page + 1 : undefined,
      refetchInterval: 30 * 60 * 1000, // Auto-refresh every 30 minutes
      onSuccess: () => setLastUpdate(new Date().toLocaleString()),
    }
  );

  // Fetch next page when in view
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Manual refresh
  const handleRefresh = async () => {
    await queryClient.invalidateQueries('news');
    refetch();
  };

  // Get all news articles from all pages
  const allArticles = data?.pages.flatMap(page => page.articles) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Glassmorphic Header */}
      <header className="backdrop-blur-xl bg-white/70 border-b border-white/20 sticky top-0 z-50 shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div>
              <h1 className="text-2xl font-bold text-black">
                A2GENT Super Agent
              </h1>
              <p className="text-xs text-gray-500 font-medium">A2GENT Intelligence</p>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {['Home', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Genspark Style */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Large Brand Text */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black">
              A2GENT SUPER AGENT
            </h1>
            <div className="mt-4">
              <p className="text-xl md:text-2xl text-gray-600 font-medium">
                AI-AGENTS TO MAKE YOUR LIFE SIMPLER
              </p>
              <div className="flex items-center justify-center mt-2 space-x-2">
              </div>
            </div>
          </div>

          {/* Glassmorphic Search Bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative backdrop-blur-xl bg-white/80 border border-white/30 rounded-3xl shadow-2xl shadow-black/10 overflow-hidden">
                <div className="flex items-center">
                  <div className="pl-8 pr-4 py-6">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="make a ppt on ai..."
                    disabled
                    className="flex-1 py-6 bg-transparent text-lg text-gray-900 placeholder-gray-500 focus:outline-none cursor-not-allowed"
                  />
                  <div className="pr-8 pl-4">
                    <div className="flex items-center space-x-3">
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm text-sm font-medium text-gray-600 rounded-xl border border-white/20">
                        Coming Soon
                      </span>
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center opacity-50">
                        <ArrowUpRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
            ].map((item, index) => (
              <div key={index} className="backdrop-blur-sm bg-white/60 border border-white/30 rounded-full px-4 py-2 shadow-lg shadow-black/5 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-2">
                  <div className={`w-5 h-5 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center`}>
                    <item.icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* News Section Header - Genspark Style Black Box */}
        <div className="text-center mb-16">
          <div className="inline-block bg-black rounded-2xl px-8 py-4 shadow-lg">
            <h2 className="text-lg md:text-xl font-bold text-white">
              AI UPDATES FOR YOU
            </h2>
          </div>
          
          {/* Refresh Button - Positioned separately */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            {lastUpdate && (
              <div className="flex items-center text-sm text-gray-500 backdrop-blur-sm bg-white/60 px-3 py-2 rounded-xl border border-white/30">
                <Clock className="w-4 h-4 mr-2" />
                {lastUpdate}
              </div>
            )}
            <button
              onClick={handleRefresh}
              disabled={isRefetching}
              className="flex items-center space-x-2 px-6 py-3 backdrop-blur-xl bg-white/80 hover:bg-white/90 border border-white/30 rounded-2xl text-gray-700 hover:text-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/5 hover:shadow-xl hover:scale-105"
            >
              <RefreshCw className={`w-5 h-5 ${isRefetching ? 'animate-spin' : ''}`} />
              <span className="font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {status === 'loading' && (
          <div className="flex justify-center py-20">
            <div className="text-center backdrop-blur-xl bg-white/80 rounded-3xl p-12 border border-white/30 shadow-2xl shadow-black/10">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-xl animate-pulse"></div>
              </div>
              <p className="text-gray-700 font-medium">Fetching latest intelligence...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="text-center py-20">
            <div className="backdrop-blur-xl bg-red-50/80 border border-red-200/50 rounded-3xl p-12 max-w-md mx-auto shadow-2xl shadow-red-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ExternalLink className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-red-900 mb-3">Intelligence Unavailable</h3>
              <p className="text-red-700 mb-6">{error?.message || 'Please check your connection and try again'}</p>
              <button
                onClick={() => refetch()}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-2xl transition-all duration-300 font-medium shadow-lg shadow-red-500/25 hover:shadow-xl hover:scale-105"
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {/* News Grid - Genspark Style */}
        {status === 'success' && (
          <>
            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: Globe,
                  label: 'Total Articles',
                  value: allArticles.length,
                  color: 'from-blue-500 to-cyan-500',
                  bg: 'from-blue-50 to-cyan-50'
                },
                {
                  icon: Sparkles,
                  label: 'AI Insights',
                  value: 'Live',
                  color: 'from-green-500 to-emerald-500',
                  bg: 'from-green-50 to-emerald-50'
                },
                {
                  icon: Calendar,
                  label: 'Update Frequency',
                  value: 'Real-time',
                  color: 'from-purple-500 to-pink-500',
                  bg: 'from-purple-50 to-pink-50'
                }
              ].map((stat, index) => (
                <div key={index} className={`backdrop-blur-xl bg-gradient-to-br ${stat.bg}/80 border border-white/30 rounded-3xl p-8 shadow-2xl shadow-black/5 hover:shadow-black/10 transition-all duration-300 hover:scale-105`}>
                  <div className="flex items-center">
                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="ml-6">
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.label}</p>
                      <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* News Cards Grid - Enhanced Genspark Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allArticles.map((article, index) => (
                <article key={`${article.id}-${index}`} className="group">
                  <div className="backdrop-blur-xl bg-white/80 border border-white/30 rounded-3xl overflow-hidden shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
                    {/* Article Image */}
                    {article.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          <div className="backdrop-blur-sm bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                            AI News
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-8">
                      {/* Metadata */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Globe className="w-4 h-4 mr-2" />
                          <span className="font-medium">{article.source || 'AI Intelligence'}</span>
                        </div>
                        <time className="text-sm text-gray-500 font-medium">
                          {new Date(article.published_at || Date.now()).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </time>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {article.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                        {article.description || article.summary}
                      </p>

                      {/* Action */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {article.tags?.slice(0, 2).map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold text-sm transition-all duration-300 hover:scale-105"
                        >
                          <span>Read Full Story</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Section */}
            {hasNextPage && (
              <div ref={ref} className="flex justify-center py-16">
                {isFetchingNextPage ? (
                  <div className="backdrop-blur-xl bg-white/80 rounded-2xl px-8 py-4 border border-white/30 shadow-lg shadow-black/5">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                      <span className="font-medium">Loading more intelligence...</span>
                    </div>
                  </div>
                ) : (
                  <div className="backdrop-blur-xl bg-white/60 rounded-2xl px-6 py-3 border border-white/30 text-gray-500 font-medium">
                    Scroll to discover more...
                  </div>
                )}
              </div>
            )}

            {/* End of Feed */}
            {!hasNextPage && allArticles.length > 0 && (
              <div className="text-center py-16">
                <div className="backdrop-blur-xl bg-gradient-to-r from-green-50/80 to-emerald-50/80 border border-white/30 rounded-3xl px-12 py-8 inline-block shadow-xl shadow-black/5">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">You're All Caught Up!</h3>
                      <p className="text-gray-600">Check back soon for fresh intelligence</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {allArticles.length === 0 && (
              <div className="text-center py-20">
                <div className="backdrop-blur-xl bg-white/80 border border-white/30 rounded-3xl p-16 max-w-md mx-auto shadow-2xl shadow-black/10">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Search className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Intelligence Available</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">Our AI agents are working to gather the latest news. Check back in a moment for fresh updates.</p>
                  <button
                    onClick={handleRefresh}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105"
                  >
                    Refresh Intelligence
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Glassmorphic Footer */}
      <footer className="backdrop-blur-xl bg-white/70 border-t border-white/20 shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Powered by A2GENT Super Agent AI
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Intelligent news curation from global sources • Real-time AI analysis • Updated continuously
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span>🌍 Global Coverage</span>
              <span>⚡ Real-time Updates</span>
              <span>🤖 AI Powered</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
