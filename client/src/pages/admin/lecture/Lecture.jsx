import React from 'react';
import { Youtube, Clock, Hash } from 'lucide-react';

const Lecture = ({ lecture }) => {
  // Extract YouTube video ID for thumbnail
  const extractYouTubeVideoId = (url) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const videoId = lecture.youtubeVideoId || extractYouTubeVideoId(lecture.videoUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

  return (
    <div className="border border-gray-200 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* YouTube Thumbnail */}
        {thumbnailUrl && (
          <div className="flex-shrink-0">
            <img 
              src={thumbnailUrl} 
              alt={lecture.lectureTitle}
              className="w-24 h-16 object-cover rounded-lg border"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {/* Lecture Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-gray-800 text-base truncate">
              {lecture.lectureTitle}
            </h3>
            {lecture.sequence && (
              <span className="flex items-center text-xs text-gray-500 ml-2">
                <Hash className="w-3 h-3 mr-1" />
                {lecture.sequence}
              </span>
            )}
          </div>
          
          {lecture.lectureDescription && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {lecture.lectureDescription}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            {videoId && (
              <span className="flex items-center">
                <Youtube className="w-3 h-3 mr-1 text-red-500" />
                YouTube
              </span>
            )}
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(lecture.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lecture;
