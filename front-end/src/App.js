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
function App() {
  return (
    <Routes>
      {/**Home */}
      <Route path="/" element={<Home />} />
      <Route path="/course/:courseId" element={<SubjectDetail />} />
      <Route path="/expert/:id" element={<ExpertDetail />} />
      {/**Admin */}
      <Route path="/admin/home/" element={<ProtectedRoute requiredRole="Admin"><AdminHome /></ProtectedRoute>}>
        <Route path="employee-profile" element={<Employee />} />
      </Route>
      {/**Expert */}
      <Route path="/Expert/Home" element={<ProtectedRoute requiredRole="Teacher"><ExpertHome /></ProtectedRoute>}>
        <Route path="subject-manage" element={<SubjectManage />} />
        <Route path="lesson-manage" element={<LessonManage />} />
        <Route path="quiz-manage" element={<QuizManage />} />

      </Route>
    </Routes>

  );
}

export default App;
