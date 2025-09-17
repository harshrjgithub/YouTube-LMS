import React, { useState, useEffect } from 'react';
import { AlertCircle, Youtube, ExternalLink, CheckCircle, Circle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useMarkLectureCompletedMutation, useGetCourseProgressQuery } from '@/features/api/authApi';
import { toast } from 'sonner';

const LecturePlayer = ({ lecture, courseId }) => {
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  
  const [markLectureCompleted, { isLoading: isMarkingComplete }] = useMarkLectureCompletedMutation();
  const { data: progressData, refetch: refetchProgress } = useGetCourseProgressQuery(courseId, {
    skip: !isAuthenticated || !courseId
  });

  // Check if this lecture is completed
  const isCompleted = progressData?.progress?.completedLectures?.some(
    cl => cl.lectureId === lecture._id
  );

  // Extract YouTube video ID
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

  useEffect(() => {
    setVideoError(false);
    setIsLoading(true);
  }, [lecture._id]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setVideoError(true);
    setIsLoading(false);
  };

  const handleMarkComplete = async () => {
    if (!isAuthenticated || !courseId) {
      toast.error('Please login to track your progress');
      return;
    }

    try {
      await markLectureCompleted({ courseId, lectureId: lecture._id }).unwrap();
      toast.success('Lecture marked as completed!');
      refetchProgress();
    } catch (error) {
      console.error('Error marking lecture complete:', error);
      toast.error(error?.data?.message || 'Failed to mark lecture as completed');
    }
  };

  if (!videoId) {
    return (
      <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 overflow-hidden">
        <div className="aspect-video bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Invalid Video URL</p>
            <p className="text-sm text-gray-500 mt-1">Unable to extract YouTube video ID</p>
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{lecture.lectureTitle}</h2>
          {lecture.lectureDescription && (
            <p className="text-gray-600">{lecture.lectureDescription}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 overflow-hidden">
      {/* Video Player */}
      <div className="relative aspect-video bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading video...</p>
            </div>
          </div>
        )}
        
        {videoError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Video Unavailable</p>
              <p className="text-sm text-gray-500 mt-1 mb-4">This video might be private or removed</p>
              <a
                href={lecture.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Open in YouTube
              </a>
            </div>
          </div>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`}
            title={lecture.lectureTitle}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        )}
      </div>

      {/* Lecture Details */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-800">{lecture.lectureTitle}</h2>
              {isAuthenticated && (
                <div className="flex items-center">
                  {isCompleted ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-1" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  ) : (
                    <Button
                      onClick={handleMarkComplete}
                      disabled={isMarkingComplete}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                    >
                      {isMarkingComplete ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                      <span className="text-sm">Mark Complete</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
            {lecture.lectureDescription && (
              <p className="text-gray-600 leading-relaxed">{lecture.lectureDescription}</p>
            )}
          </div>
          <div className="flex items-center ml-4">
            <Youtube className="w-5 h-5 text-red-500 mr-1" />
            <span className="text-sm text-gray-500">YouTube</span>
          </div>
        </div>

        {/* Progress Info */}
        {isAuthenticated && progressData?.progress && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-800 font-medium">Course Progress</span>
              <span className="text-blue-600">
                {progressData.progress.completedLectures.length} of {progressData.progress.totalLectures} completed
                ({progressData.progress.progressPercentage}%)
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressData.progress.progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Lecture Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-white/30">
          <span>
            Lecture {lecture.sequence || 1}
          </span>
          <span>
            Added {new Date(lecture.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LecturePlayer;