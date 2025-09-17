import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Youtube, Upload, Plus, List, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  useCreateLectureMutation, 
  useGetCourseByIdQuery, 
  useImportPlaylistLecturesMutation 
} from '@/features/api/courseApi';
import { toast } from 'sonner';
import Lecture from './Lecture';

const CreateLecture = () => {
  // Mode state: 'manual' or 'playlist'
  const [mode, setMode] = useState('manual');
  
  // Manual mode states
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureDescription, setLectureDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  
  // Playlist mode states
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [importProgress, setImportProgress] = useState(null);
  
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [createLecture, { isLoading: isCreatingLecture }] = useCreateLectureMutation();
  const [importPlaylistLectures, { isLoading: isImportingPlaylist }] = useImportPlaylistLecturesMutation();
  const {
    data: course,
    isLoading: lectureLoading,
    error: lectureError,
    refetch,
  } = useGetCourseByIdQuery(courseId);

  const lectures = course?.course?.lectures || [];

  // Helper function to extract YouTube video ID
  const extractYouTubeVideoId = (url) => {
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

  // Helper function to extract YouTube playlist ID
  const extractYouTubePlaylistId = (url) => {
    const patterns = [
      /[?&]list=([a-zA-Z0-9_-]+)/,
      /^([a-zA-Z0-9_-]{5,})$/ // Direct playlist ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const createLectureHandler = async () => {
    if (!lectureTitle.trim()) {
      toast.error('Lecture title is required!');
      return;
    }
    if (!videoUrl.trim()) {
      toast.error('Video URL is required!');
      return;
    }

    // Validate YouTube URL
    const videoId = extractYouTubeVideoId(videoUrl);
    if (!videoId) {
      toast.error('Please provide a valid YouTube URL or video ID');
      return;
    }

    try {
      await createLecture({ 
        courseId, 
        lectureTitle, 
        lectureDescription,
        videoUrl 
      }).unwrap();
      toast.success('Lecture created successfully!');
      setLectureTitle('');
      setLectureDescription('');
      setVideoUrl('');
      refetch();
    } catch (err) {
      console.error('Error creating lecture:', err);
      toast.error(err?.data?.message || 'Failed to create lecture.');
    }
  };

  const importPlaylistHandler = async () => {
    if (!playlistUrl.trim()) {
      toast.error('Playlist URL is required!');
      return;
    }

    // Extract playlist ID
    const playlistId = extractYouTubePlaylistId(playlistUrl);
    if (!playlistId) {
      toast.error('Please provide a valid YouTube playlist URL or playlist ID');
      return;
    }

    setImportProgress({ status: 'importing', message: 'Importing playlist...' });

    try {
      const result = await importPlaylistLectures({ 
        courseId, 
        playlistId,
        replaceExisting 
      }).unwrap();

      setImportProgress({ 
        status: 'success', 
        message: result.message,
        data: result.data
      });

      toast.success(result.message);
      setPlaylistUrl('');
      refetch();

      // Clear progress after 5 seconds
      setTimeout(() => setImportProgress(null), 5000);

    } catch (err) {
      console.error('Error importing playlist:', err);
      const errorMessage = err?.data?.message || 'Failed to import playlist';
      
      setImportProgress({ 
        status: 'error', 
        message: errorMessage 
      });

      toast.error(errorMessage);

      // Clear progress after 5 seconds
      setTimeout(() => setImportProgress(null), 5000);
    }
  };

  const backToCourseHandler = () => {
    navigate('/admin/courses');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🎥 Manage Course Lectures</h1>
        <p className="text-gray-600">Add lectures individually or import from a YouTube playlist.</p>
      </div>

      {/* Mode Selection */}
      <div className="mb-8">
        <Label className="block text-sm font-medium text-gray-700 mb-3">
          Choose Import Mode
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
              mode === 'manual' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setMode('manual')}
          >
            <div className="flex items-center gap-3">
              <Plus className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Manual Mode</h3>
                <p className="text-sm text-gray-600">Add lectures one by one</p>
              </div>
            </div>
          </div>
          
          <div 
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
              mode === 'playlist' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setMode('playlist')}
          >
            <div className="flex items-center gap-3">
              <List className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Playlist Import</h3>
                <p className="text-sm text-gray-600">Import from YouTube playlist</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Mode Form */}
      {mode === 'manual' && (
        <div className="space-y-6 mb-8">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Lecture Title
            </Label>
            <Input
              type="text"
              placeholder="Enter lecture title"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Lecture Description
            </Label>
            <Textarea
              placeholder="Enter lecture description (optional)"
              value={lectureDescription}
              onChange={(e) => setLectureDescription(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              rows={4}
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              <Youtube className="inline w-4 h-4 mr-1" />
              YouTube Video URL
            </Label>
            <Input
              type="text"
              placeholder="https://www.youtube.com/watch?v=... or video ID"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supports YouTube URLs or direct video IDs (e.g., dQw4w9WgXcQ)
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={createLectureHandler}
              disabled={isCreatingLecture}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition duration-300"
            >
              {isCreatingLecture ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2" size={16} />
                  Create Lecture
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Playlist Import Mode Form */}
      {mode === 'playlist' && (
        <div className="space-y-6 mb-8">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              <List className="inline w-4 h-4 mr-1" />
              YouTube Playlist URL
            </Label>
            <Input
              type="text"
              placeholder="https://www.youtube.com/playlist?list=... or playlist ID"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supports YouTube playlist URLs or direct playlist IDs
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="replaceExisting"
              checked={replaceExisting}
              onChange={(e) => setReplaceExisting(e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <Label htmlFor="replaceExisting" className="text-sm text-gray-700">
              Replace existing lectures (this will delete all current lectures)
            </Label>
          </div>

          {replaceExisting && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-800 font-medium">Warning</p>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                This will permanently delete all existing lectures and replace them with the playlist content.
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isImportingPlaylist}
                  className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition duration-300"
                >
                  {isImportingPlaylist ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2" size={16} />
                      Import Playlist
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Import YouTube Playlist</AlertDialogTitle>
                  <AlertDialogDescription>
                    {replaceExisting 
                      ? "This will delete all existing lectures and import the playlist. This action cannot be undone."
                      : "This will import all videos from the playlist as new lectures."
                    }
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={importPlaylistHandler}
                    className={replaceExisting ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                  >
                    {replaceExisting ? "Replace & Import" : "Import Playlist"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}

      {/* Import Progress */}
      {importProgress && (
        <div className={`p-4 rounded-lg mb-6 ${
          importProgress.status === 'success' ? 'bg-green-50 border border-green-200' :
          importProgress.status === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center gap-2">
            {importProgress.status === 'importing' && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
            {importProgress.status === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {importProgress.status === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
            <p className={`font-medium ${
              importProgress.status === 'success' ? 'text-green-800' :
              importProgress.status === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {importProgress.message}
            </p>
          </div>
          
          {importProgress.data && (
            <div className="mt-2 text-sm text-gray-600">
              <p>Imported: {importProgress.data.importedCount} lectures</p>
              {importProgress.data.skippedCount > 0 && (
                <p>Skipped: {importProgress.data.skippedCount} (duplicates)</p>
              )}
              {importProgress.data.errorCount > 0 && (
                <p>Errors: {importProgress.data.errorCount}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mb-8">
        <Button
          onClick={backToCourseHandler}
          variant="outline"
          className="px-6 py-2 rounded-xl transition duration-300"
        >
          ⬅️ Back to Courses
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📚 Lectures</h2>

        {lectures.length > 0 ? (
          <div className="space-y-4">
            {lectures.map((lecture) => (
              <Lecture key={lecture._id} lecture={lecture} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No lectures added yet.</p>
        )}
      </div>
    </div>
  );
};

export default CreateLecture;