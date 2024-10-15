import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/index'
import AdminHome from './pages/admin/index'
import ProtectedRoute from './service/protected_route'
import ExpertHome from './pages/expert/index'
import Employee from '../src/pages/admin/component/employee_manage'
import SubjectManage from './pages/expert/component/subject-manage'
import LessonManage from './pages/expert/component/lesson-manage'
import QuizManage from "./pages/expert/component/quiz-manage"
import SubjectDetail from './pages/Home/component/courses/course-detail'
import ExpertDetail from './pages/Home/component/expert/expert-detail'
import ExpertListAll from './pages/Home/component/expert/expert-list-all';
import CourseListAll from './pages/Home/component/courses/course-list';
import UserProfile from './pages/Home/component/user-profile';
import ManageProfile from './pages/admin/component/profile';
import Register from './layouts/registration';
import ForgotPassword from './layouts/navbar/forgot-password';
import Question from './pages/expert/component/question';
function App() {
  return (
    <Routes>
      {/**Home */}
      <Route path="/" element={<Home />} />
      <Route path="/course/:courseId" element={<SubjectDetail />} />
      <Route path="/expert/:id" element={<ExpertDetail />} />
      <Route path="/experts" element={<ExpertListAll />} />
      <Route path="/courses" element={<CourseListAll />} />
      <Route path="/UserProfile" element={<ProtectedRoute requiredRole="Student"><UserProfile /></ProtectedRoute>}/>
      <Route path="/register" element={<Register />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />

      {/**Admin */}
      <Route path="/admin/home/" element={<ProtectedRoute requiredRole="Admin"><AdminHome /></ProtectedRoute>}>
        <Route path="employee-profile" element={<Employee />} />
        <Route path="user-profile" element={<ManageProfile />} />
      </Route>
      {/**Expert */}
      <Route path="/Expert/Home" element={<ProtectedRoute requiredRole="Teacher"><ExpertHome /></ProtectedRoute>}>
        <Route path="subject-manage" element={<SubjectManage />} />
        <Route path="lesson-manage" element={<LessonManage />} />
        <Route path="quiz-manage" element={<QuizManage />} />
        <Route path="user-profile" element={<ManageProfile />} />
        <Route path="question/:quizId" element={<Question />} />
      </Route>
    </Routes>

  );
}

export default App;
