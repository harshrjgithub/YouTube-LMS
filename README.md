# YouTube LMS

A comprehensive Learning Management System (LMS) that integrates YouTube videos for course content delivery. This platform allows instructors to create courses with YouTube video lectures and provides students with a distraction-free learning environment.

## Features

### Admin/Instructor Features
- **Course Management**: Create, edit, and manage courses with detailed information
- **Lecture Management**: Add lectures to courses with YouTube video integration
- **YouTube Integration**: Automatic video validation and thumbnail generation
- **Course Organization**: Organize lectures in sequential order
- **Real-time Updates**: Changes reflect immediately for students

### Student Features
- **Course Browsing**: View all available courses with detailed information
- **Embedded Video Player**: Watch YouTube videos directly on the platform without distractions
- **Course Progress**: Navigate through lectures in organized playlists
- **Responsive Design**: Optimized for all device sizes

### Technical Features
- **YouTube API Integration**: Validates video URLs and extracts video IDs
- **Error Handling**: Graceful handling of invalid URLs and unavailable videos
- **Real-time Data**: Redux Toolkit Query for efficient data management
- **Modern UI**: Built with Tailwind CSS and Radix UI components

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **YouTube Data API v3** for video validation
- **CORS** and security middleware

### Frontend
- **React 19** with Vite
- **Redux Toolkit Query** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons

## Project Structure

```
├── server/
│   ├── controllers/
│   │   ├── course.controller.js    # Course and lecture management
│   │   └── user.controller.js      # User authentication
│   ├── models/
│   │   ├── course.model.js         # Course schema
│   │   ├── lecture.model.js        # Lecture schema (enhanced)
│   │   └── user.model.js           # User schema
│   ├── routes/
│   │   ├── course.route.js         # Course API routes
│   │   └── user.route.js           # User API routes
│   └── index.js                    # Server entry point
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── courses/        # Admin course management
│   │   │   │   └── lecture/        # Admin lecture management
│   │   │   └── student/
│   │   │       ├── Courses.jsx     # Course listing (updated)
│   │   │       ├── CourseDetail.jsx # Individual course view (new)
│   │   │       └── LecturePlayer.jsx # YouTube video player (new)
│   │   ├── features/api/
│   │   │   └── courseApi.js        # API integration (enhanced)
│   │   └── components/ui/          # Reusable UI components
│   └── package.json
```

## Recent Enhancements

### Backend Improvements
1. **Enhanced Authentication & Authorization**:
   - Fixed authentication middleware for proper token validation
   - Added admin authorization middleware (`isAdmin.js`)
   - Implemented role-based access control (student, instructor, admin)
   - Enhanced error handling for unauthorized access
   - Added user profile endpoint for authentication status

2. **Course Management**:
   - **Delete Course Functionality**: Secure course deletion with cascade delete of lectures
   - **Analytics Dashboard**: Comprehensive analytics with course statistics, enrollment data, and popular courses
   - **Playlist Import**: YouTube playlist import functionality with batch lecture creation
   - Enhanced error handling and logging for all operations

3. **Enhanced Lecture Model**:
   - Added `lectureDescription` field for detailed lecture information
   - Added `youtubeVideoId` field for direct video ID storage
   - Improved sequence handling for lecture ordering

4. **YouTube Integration**:
   - YouTube URL validation and video ID extraction
   - Video availability checking via YouTube API
   - Support for multiple YouTube URL formats
   - **Playlist Import**: Automatic import of entire YouTube playlists
   - Error handling for invalid or unavailable videos
   - Duplicate detection and prevention

### Frontend Improvements
1. **Enhanced Admin Dashboard**:
   - **Real-time Analytics**: Live dashboard with course statistics, enrollments, and popular courses
   - **Advanced Course Management**: Search, filter, and sort courses by various criteria
   - **Secure Delete**: Confirmation dialogs with proper error handling for course deletion
   - **Dual-mode Lecture Creation**: Manual lecture addition and YouTube playlist import
   - **Import Progress Tracking**: Real-time feedback during playlist imports
   - Mobile-responsive design with improved UX

2. **Lecture Management System**:
   - **Manual Mode**: Individual lecture creation with title, description, and YouTube URL
   - **Playlist Import Mode**: Bulk import from YouTube playlists with progress tracking
   - **Import Options**: Replace existing lectures or append to current content
   - **Error Handling**: Graceful handling of import errors and unavailable videos
   - **Duplicate Prevention**: Automatic detection and skipping of duplicate content

3. **Student Interface**:
   - Real course data integration (replaced static data)
   - New CourseDetail page for individual course viewing
   - YouTube video player with embedded, distraction-free viewing
   - Organized lecture playlist with progress tracking
   - Responsive design for all screen sizes

4. **UI/UX Improvements**:
   - Modern glassmorphism design with backdrop blur effects
   - Improved loading states and error handling
   - Better visual hierarchy and information architecture
   - Accessible components with proper ARIA labels
   - Enhanced confirmation dialogs and user feedback

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- YouTube Data API v3 key

### Backend Setup
```bash
cd server
npm install
# Configure .env file with your credentials
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Environment Variables
Create a `.env` file in the server directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_DAILY_QUOTA=10000
```

## API Endpoints

### Course Management
- `GET /api/v1/courses` - Get all courses
- `POST /api/v1/courses` - Create new course
- `GET /api/v1/courses/:id` - Get course by ID
- `PUT /api/v1/courses/:id` - Update course

### Lecture Management
- `POST /api/v1/courses/:courseId/lectures` - Create lecture
- `GET /api/v1/courses/:courseId/lectures` - Get course lectures

## Usage Guide

### For Instructors
1. **Create a Course**: Navigate to Admin → Courses → Create New Course
2. **Add Lectures**: Go to course management and click "Lectures"
3. **Add YouTube Videos**: Paste YouTube URLs or video IDs
4. **Organize Content**: Lectures are automatically sequenced

### For Students
1. **Browse Courses**: Visit the courses page to see all available courses
2. **View Course Details**: Click "View Course" to see lectures and course info
3. **Watch Videos**: Click on any lecture to start watching
4. **Navigate Content**: Use the playlist sidebar to jump between lectures

## YouTube Integration Details

### Supported URL Formats
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- Direct video ID: `VIDEO_ID`

### Features
- **Automatic Validation**: Checks if videos exist and are accessible
- **Thumbnail Generation**: Automatically generates video thumbnails
- **Distraction-Free Viewing**: Embedded player with minimal YouTube branding
- **Error Handling**: Graceful fallbacks for unavailable videos

## Testing the Implementation

### Prerequisites for Testing
1. **Create Admin User**: Register a new user (default role is now "instructor" for testing)
2. **YouTube API Key**: Ensure `YOUTUBE_API_KEY` is configured in server `.env` file
3. **Authentication**: Login to access admin features

### Admin Authentication Testing
1. **Registration**: Create a new account (automatically gets instructor role)
2. **Login**: Test login functionality with valid credentials
3. **Authorization**: Verify admin routes are protected and require authentication
4. **Token Validation**: Test that expired or invalid tokens are handled properly

### Course Management Testing

#### Course Creation & Editing
1. Navigate to `/admin/courses`
2. Click "Create New Course" and fill in all required fields
3. Test course editing by clicking the edit button
4. Verify course data persists correctly

#### Course Deletion Testing
1. **Basic Deletion**: 
   - Click the delete (trash) icon on any course
   - Verify confirmation dialog appears
   - Confirm deletion and verify course is removed
   - Check that associated lectures are also deleted

2. **Authorization Testing**:
   - Test deletion without authentication (should fail with 401)
   - Test deletion with student role (should fail with 403)
   - Verify proper error messages are displayed

3. **Edge Cases**:
   - Try deleting non-existent course
   - Test deletion of course with many lectures
   - Verify UI updates without page reload

### Lecture Management Testing

#### Manual Lecture Addition
1. Navigate to course lecture management
2. Select "Manual Mode"
3. **Valid Input Testing**:
   - Add lecture with YouTube URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Add lecture with direct video ID: `dQw4w9WgXcQ`
   - Include title and description
   - Verify lecture appears immediately

4. **Validation Testing**:
   - Try submitting without title (should show error)
   - Try invalid YouTube URL (should show error)
   - Test with private/deleted video (should show error)

#### Playlist Import Testing
1. Select "Playlist Import Mode"
2. **Valid Playlist Testing**:
   - Use test playlist: `https://www.youtube.com/playlist?list=PLrAXtmRdnEQy6nuLvVeqmEeWn7xfzsV8P`
   - Test with direct playlist ID: `PLrAXtmRdnEQy6nuLvVeqmEeWn7xfzsV8P`
   - Monitor import progress
   - Verify all videos are imported with correct sequence

3. **Import Options Testing**:
   - Test "Replace Existing" option (should show warning)
   - Test appending to existing lectures
   - Verify duplicate detection works

4. **Error Handling Testing**:
   - Test with invalid playlist ID
   - Test with private playlist
   - Test with empty playlist
   - Verify error messages are clear and helpful

### Analytics Dashboard Testing
1. Navigate to `/admin/dashboard`
2. **Data Verification**:
   - Verify total courses count matches actual courses
   - Check total lectures count
   - Verify enrollment statistics
   - Test popular courses ranking

3. **Real-time Updates**:
   - Create a new course and verify dashboard updates
   - Delete a course and verify counts decrease
   - Add lectures and verify lecture count increases

### Student Interface Testing
1. **Course Browsing**:
   - Visit `/courses` and verify real course data loads
   - Test course filtering and search (if implemented)
   - Verify course cards show correct information

2. **Course Detail Page**:
   - Click on any course to view detail page
   - Verify course information displays correctly
   - Test lecture playlist navigation

3. **Video Player Testing**:
   - Click on lectures to test video playback
   - Verify YouTube videos embed correctly
   - Test with different video types (public, unlisted)
   - Verify distraction-free viewing (no external YouTube links)

### Advanced Testing Scenarios

#### Concurrent Operations
1. Have multiple admin users managing courses simultaneously
2. Test playlist import while other admin is adding manual lectures
3. Verify data consistency and proper error handling

#### Performance Testing
1. Import large playlists (50+ videos)
2. Test dashboard performance with many courses
3. Verify pagination and loading states work properly

#### Security Testing
1. **Authentication Bypass Attempts**:
   - Try accessing admin routes without login
   - Test with expired tokens
   - Verify proper 401/403 responses

2. **Authorization Testing**:
   - Create student user and try accessing admin features
   - Test role-based restrictions
   - Verify proper error messages

#### Error Recovery Testing
1. **Network Interruption**:
   - Start playlist import and disconnect internet
   - Verify graceful error handling
   - Test retry mechanisms

2. **API Quota Limits**:
   - Test behavior when YouTube API quota is exceeded
   - Verify proper error messages and fallback behavior

### Mobile Responsiveness Testing
1. Test all admin interfaces on mobile devices
2. Verify touch interactions work properly
3. Test responsive design breakpoints
4. Verify mobile navigation and usability

### Browser Compatibility Testing
1. Test on Chrome, Firefox, Safari, Edge
2. Verify all features work across browsers
3. Test with different screen sizes and resolutions

## Troubleshooting Common Issues

### Authentication Issues
- **"Unauthorized" errors**: Check if user is logged in and has proper role
- **Token expired**: Re-login to get fresh authentication token
- **CORS errors**: Verify frontend and backend URLs match environment configuration

### YouTube API Issues
- **Quota exceeded**: Check YouTube API console for quota limits
- **Invalid API key**: Verify `YOUTUBE_API_KEY` in server environment
- **Private videos**: Ensure playlist and videos are public or unlisted

### Import Issues
- **Playlist not found**: Verify playlist ID and privacy settings
- **Partial imports**: Check server logs for specific video errors
- **Duplicate detection**: Verify existing lectures don't have same video IDs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
