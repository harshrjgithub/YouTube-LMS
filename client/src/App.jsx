import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import Sidebar from './pages/admin/Sidebar.jsx';
import HeroSection from './pages/student/HeroSection';
import Courses from './pages/student/Courses';
import CourseDetail from './pages/student/CourseDetail';
import Profile from './pages/student/Profile';
import MyCourses from './pages/student/MyCourses';
import Login from './pages/Login';
import MainLayout from './layout/MainLayout';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import CourseTable from './pages/admin/courses/CourseTable';
import AddCourses from './pages/admin/courses/AddCourses';
import EditCourse from './pages/admin/courses/EditCourse';
import CreateLecture from './pages/admin/lecture/CreateLecture';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/auth/AdminRoute';
import StudentRoute from './components/auth/StudentRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';


const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Login />,
      },
      {
        path: 'courses',
        element: <Courses />,
      },
      {
        path: 'course/:courseId',
        element: <CourseDetail />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-courses',
        element: (
          <ProtectedRoute>
            <MyCourses />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />, // Redirect to dashboard by default
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'courses',
        element: <CourseTable />,
      },
      {
        path: 'courses/create',
        element: <AddCourses />,
      },
      {
        path: 'courses/:courseId',
        element: <EditCourse />,
      },
      {
        path: 'courses/:courseId/lectures',
        element: <CreateLecture />,
      }
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <main>
        <RouterProvider router={appRouter} />
      </main>
    </AuthProvider>
  );
}

export default App;