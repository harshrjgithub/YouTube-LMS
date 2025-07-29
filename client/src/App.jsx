import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import Sidebar from './pages/admin/Sidebar.jsx';
import HeroSection from './pages/student/HeroSection';
import Courses from './pages/student/Courses';
import Login from './pages/Login';
import MainLayout from './layout/MainLayout';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import CourseTable from './pages/admin/courses/CourseTable';
import AddCourses from './pages/admin/courses/AddCourses';
import EditCourse from './pages/admin/courses/EditCourse';
import CreateLecture from './pages/admin/lecture/CreateLecture';


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
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />, // Use AdminLayout for admin routes
    children: [
      {
        index: true,
        element: <h1>Welcome to Admin Panel</h1>, // Default content for /admin
      },
      {
        path: 'dashboard',
        element: <Dashboard />, // Admin Dashboard component
      },
      {
        path: 'courses',
        element: <CourseTable />, // Admin Courses component
      },
      {
        path: 'courses/create',
        element: <AddCourses />, // Admin Add Courses component
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
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
}

export default App;