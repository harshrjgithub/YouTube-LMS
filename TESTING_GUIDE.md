# LMS Testing Guide

## Authentication & Role-Based Access Testing

### Admin Login Testing

#### Test Case 1: Exclusive Admin Login
**Credentials:**
- Email: `adminlms@gmail.com`
- Password: `admin123`

**Expected Behavior:**
1. Navigate to `/login`
2. Enter admin credentials
3. Should redirect to `/admin/dashboard`
4. Should have access to all admin features:
   - Course management
   - Lecture creation
   - Analytics dashboard
   - User management

**Test Steps:**
```bash
1. Open http://localhost:5173/login
2. Click "Login" tab
3. Enter: adminlms@gmail.com
4. Enter: admin123
5. Click "Login"
6. Verify redirect to /admin/dashboard
7. Verify admin navbar shows "LMS Admin"
8. Verify sidebar shows admin navigation
```

#### Test Case 2: Admin Route Protection
**Test Steps:**
1. Without logging in, try to access `/admin/dashboard`
2. Should redirect to `/login`
3. After admin login, should have access to all admin routes:
   - `/admin/dashboard`
   - `/admin/courses`
   - `/admin/courses/create`
   - `/admin/courses/:id`
   - `/admin/courses/:id/lectures`

### Student Registration & Login Testing

#### Test Case 3: Student Registration
**Test Steps:**
```bash
1. Navigate to /login
2. Click "Signup" tab
3. Enter student details:
   - Name: "John Student"
   - Email: "john@example.com"
   - Password: "password123"
4. Click "Sign Up"
5. Should show success message
6. Should switch to login tab
```

#### Test Case 4: Student Login
**Test Steps:**
```bash
1. Use registered student credentials
2. Should redirect to /courses
3. Should NOT have access to admin routes
4. Navbar should show "LMS" (not "LMS Admin")
5. Should see student-specific navigation
```

#### Test Case 5: Prevent Admin Email Registration
**Test Steps:**
```bash
1. Try to register with adminlms@gmail.com
2. Should show error: "This email is reserved for system administration"
3. Registration should fail
```

### Role-Based Route Protection Testing

#### Test Case 6: Student Accessing Admin Routes
**Test Steps:**
```bash
1. Login as student
2. Try to access /admin/dashboard directly
3. Should redirect to /courses
4. Should show access denied behavior
```

#### Test Case 7: Admin Accessing Student Routes
**Test Steps:**
```bash
1. Login as admin
2. Can access both admin and student routes
3. Navbar should show admin-specific options
```

## UI Consistency Testing

### Layout Consistency Testing

#### Test Case 8: Responsive Design
**Test Steps:**
```bash
1. Test on different screen sizes:
   - Mobile (320px - 768px)
   - Tablet (768px - 1024px)
   - Desktop (1024px+)
2. Verify consistent spacing
3. Verify readable text
4. Verify accessible buttons
```

#### Test Case 9: Navigation Consistency
**Test Steps:**
```bash
1. Verify navbar height is consistent (64px)
2. Verify content starts below navbar (pt-16)
3. Verify consistent padding in containers
4. Verify consistent button spacing
```

#### Test Case 10: Admin Layout Consistency
**Test Steps:**
```bash
1. Login as admin
2. Navigate through admin pages
3. Verify consistent sidebar width
4. Verify consistent content padding
5. Verify consistent page headers
```

### Visual Consistency Testing

#### Test Case 11: Color Scheme Consistency
**Test Steps:**
```bash
1. Verify purple theme consistency:
   - Primary: purple-600
   - Hover: purple-700
   - Background: purple-50
2. Verify consistent button styles
3. Verify consistent form styling
```

#### Test Case 12: Typography Consistency
**Test Steps:**
```bash
1. Verify consistent heading sizes:
   - h1: text-3xl font-bold
   - h2: text-2xl font-semibold
   - h3: text-xl font-medium
2. Verify consistent text colors
3. Verify consistent line heights
```

## Functional Testing

### Course Management Testing (Admin Only)

#### Test Case 13: Create Course
**Test Steps:**
```bash
1. Login as admin
2. Navigate to /admin/courses
3. Click "Create New Course"
4. Fill in course details
5. Verify course appears in list
```

#### Test Case 14: Delete Course
**Test Steps:**
```bash
1. Login as admin
2. Navigate to /admin/courses
3. Click delete button on any course
4. Verify confirmation dialog
5. Confirm deletion
6. Verify course is removed
```

#### Test Case 15: Lecture Management
**Test Steps:**
```bash
1. Login as admin
2. Navigate to course lectures
3. Test manual lecture creation
4. Test playlist import
5. Verify lectures appear for students
```

### Student Experience Testing

#### Test Case 16: Course Browsing
**Test Steps:**
```bash
1. Login as student
2. Navigate to /courses
3. Verify courses display correctly
4. Click on a course
5. Verify course detail page
```

#### Test Case 17: Video Playback
**Test Steps:**
```bash
1. Login as student
2. Navigate to course with lectures
3. Click on a lecture
4. Verify YouTube video embeds correctly
5. Verify distraction-free viewing
```

## Security Testing

### Authentication Security Testing

#### Test Case 18: Token Validation
**Test Steps:**
```bash
1. Login and get valid token
2. Manually expire token (wait or modify)
3. Try to access protected routes
4. Should redirect to login
```

#### Test Case 19: Role Tampering
**Test Steps:**
```bash
1. Login as student
2. Try to modify role in browser dev tools
3. Try to access admin routes
4. Should be denied access
```

#### Test Case 20: Password Security
**Test Steps:**
```bash
1. Verify passwords are hashed in database
2. Verify no plain text passwords
3. Verify password validation (min 6 chars)
```

## Error Handling Testing

### Network Error Testing

#### Test Case 21: API Errors
**Test Steps:**
```bash
1. Disconnect internet
2. Try to login
3. Verify error message
4. Reconnect and retry
```

#### Test Case 22: Invalid Credentials
**Test Steps:**
```bash
1. Try login with wrong password
2. Verify error message
3. Try with non-existent email
4. Verify error message
```

### UI Error States

#### Test Case 23: Loading States
**Test Steps:**
```bash
1. Verify loading spinners appear
2. Verify loading states don't hang
3. Verify error boundaries work
```

## Performance Testing

### Load Time Testing

#### Test Case 24: Page Load Performance
**Test Steps:**
```bash
1. Measure initial page load
2. Measure route transitions
3. Verify smooth animations
4. Check for memory leaks
```

## Accessibility Testing

### Keyboard Navigation

#### Test Case 25: Keyboard Accessibility
**Test Steps:**
```bash
1. Navigate using only keyboard
2. Verify all buttons are focusable
3. Verify proper tab order
4. Verify focus indicators
```

### Screen Reader Testing

#### Test Case 26: Screen Reader Compatibility
**Test Steps:**
```bash
1. Test with screen reader
2. Verify proper ARIA labels
3. Verify semantic HTML
4. Verify alt text on images
```

## Browser Compatibility Testing

### Cross-Browser Testing

#### Test Case 27: Browser Support
**Test Browsers:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Test Steps:**
```bash
1. Test all functionality in each browser
2. Verify consistent appearance
3. Verify consistent behavior
```

## Automated Testing Commands

### Run Tests
```bash
# Frontend tests
cd client
npm run test

# Backend tests
cd server
npm run test

# E2E tests
npm run test:e2e
```

### Test Coverage
```bash
# Check test coverage
npm run test:coverage
```

## Test Data

### Admin Account (Pre-seeded)
- Email: `adminlms@gmail.com`
- Password: `admin123`
- Role: `admin`

### Test Student Accounts
Create these for testing:
- Email: `student1@example.com`
- Password: `password123`
- Role: `student`

### Test YouTube URLs
For testing lecture creation:
- Single video: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Playlist: `https://www.youtube.com/playlist?list=PLrAXtmRdnEQy6nuLvVeqmEeWn7xfzsV8P`

## Expected Results Summary

### Authentication
- ✅ Only `adminlms@gmail.com` can access admin features
- ✅ Students can only access student features
- ✅ Proper role-based redirection
- ✅ Secure password handling

### UI Consistency
- ✅ Consistent spacing across all pages
- ✅ Responsive design on all devices
- ✅ Consistent color scheme and typography
- ✅ Proper loading and error states

### Functionality
- ✅ Course management works for admin
- ✅ Lecture creation and playlist import
- ✅ Student course browsing and video playback
- ✅ Proper error handling and validation

### Security
- ✅ Protected routes work correctly
- ✅ Role-based access control enforced
- ✅ Secure authentication and authorization
- ✅ No unauthorized access possible