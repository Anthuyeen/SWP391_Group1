import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/index'
import AdminHome from './pages/admin/component/dashboard'
import ProtectedRoute from './service/protected_route'
import ExpertHome from './pages/expert/index'
import Employee from '../src/pages/admin/component/employee_manage'
function App() {
  return (
    <Routes>
      {/**Home */}
      <Route path="/" element={<Home />} />
      {/**Admin */}
      <Route path="/admin/home/" element={<ProtectedRoute requiredRole="Admin"><AdminHome /></ProtectedRoute>}>
        <Route path="employee-profile" element={<Employee />} />
      </Route>
      {/**Expert */}
      <Route path="/Expert/Home" element={<ProtectedRoute requiredRole="Teacher"><ExpertHome /></ProtectedRoute>}>
      </Route>
    </Routes>

  );
}

export default App;
