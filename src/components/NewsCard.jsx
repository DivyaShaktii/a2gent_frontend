import React from 'react';
import { Clock, ExternalLink, Tag } from 'lucide-react';

const NewsCard = ({ article }) => {
  return (
    <article className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Image Section */}
      <div className="relative overflow-hidden h-48">
        <img 
          src={article.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop'} 
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Time Badge */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-white text-sm flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.time_ago || 'Unknown'}
          </span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        {/* Source Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-blue-400 text-sm font-medium bg-blue-400/20 px-3 py-1 rounded-full">
            {article.source}
          </span>
          {article.keywords && article.keywords.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-gray-400" />
              <span className="text-gray-400 text-xs">
                {article.keywords.slice(0, 2).join(', ')}
              </span>
            </div>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-white text-lg font-bold mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
          {article.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {article.description || 'No description available.'}
        </p>
        
        {/* Read More Link */}
        <a 
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium group/link transition-colors"
        >
          Read more
          <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </a>
      </div>
    </article>
  );
};

export default NewsCard;