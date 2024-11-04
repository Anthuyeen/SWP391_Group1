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
import AddQuestion from './pages/expert/component/add-question';
import ListPost from './pages/Home/component/blog/list-post';
import PostDetail from './pages/Home/component/blog/view-post';
import LessonLearn from './pages/Home/component/courses/lesson-video';
import TakeQuiz from './pages/Home/component/courses/take-quiz';
import QuizAttemp from './pages/Home/component/courses/quiz-attemp';
import QuizAttemptDetail from './pages/Home/component/courses/quiz-attemp-deail';
import ApproveSubject from './pages/moderator/components/approve-subject';
import ModeratorDash from './pages/moderator';
import LessonApprove from './pages/moderator/components/leson-approve';
import ModeratorManage from './pages/admin/component/moderator-manage';
import PostManage from './pages/moderator/components/post-manage';
import PostDetailModerator from './pages/moderator/components/post-detail';
import AddPost from './pages/moderator/components/add-post';
import EditPost from './pages/moderator/components/edit-post';
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
      <Route path="/post" element={<ListPost />} />
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/lesson/:courseId" element={<ProtectedRoute requiredRole="Student"><LessonLearn /></ProtectedRoute>}/>
      <Route path="/quiz/:quizId" element={<ProtectedRoute requiredRole="Student"><TakeQuiz /></ProtectedRoute>}/>
      <Route path="/quiz-attempt" element={<ProtectedRoute requiredRole="Student"><QuizAttemp /></ProtectedRoute>}/>
      <Route path="//quiz-attempt-detail/:attemptId" element={<ProtectedRoute requiredRole="Student"><QuizAttemptDetail /></ProtectedRoute>}/>

      {/**Admin */}
      <Route path="/admin/home/" element={<ProtectedRoute requiredRole="Admin"><AdminHome /></ProtectedRoute>}>
        <Route path="employee-profile" element={<Employee />} />
        <Route path="user-profile" element={<ManageProfile />} />
        <Route path="moderator-profile" element={<ModeratorManage />} />
      </Route>
      {/**Expert */}
      <Route path="/Expert/Home" element={<ProtectedRoute requiredRole="Teacher"><ExpertHome /></ProtectedRoute>}>
        <Route path="subject-manage" element={<SubjectManage />} />
        <Route path="lesson-manage" element={<LessonManage />} />
        <Route path="quiz-manage" element={<QuizManage />} />
        <Route path="user-profile" element={<ManageProfile />} />
        <Route path="question/:quizId" element={<Question />} />
        <Route path="add-question/:quizId" element={<AddQuestion />} />
      </Route>
      {/**Moderator */}
      <Route path="/moderator/home" element={<ProtectedRoute requiredRole="Moderator"><ModeratorDash /></ProtectedRoute>}>
        <Route path="approve-subject" element={<ApproveSubject />} />
        <Route path="approve-lesson" element={<LessonApprove />} />
        <Route path="lesson-approve/:subjectId" element={<LessonApprove />} />
        <Route path="user-profile" element={<ManageProfile />} />
        <Route path="post-manage" element={<PostManage />} />
        <Route path="post-for-moderator/:id" element={<PostDetailModerator />} />
        <Route path="add-post" element={<AddPost />} />
        <Route path="edit-post/:id" element={<EditPost />} />
      </Route>
    </Routes>

  );
}

export default App;
