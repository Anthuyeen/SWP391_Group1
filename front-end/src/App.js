import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/index'
import AdminHome from '../src/pages/admin/index'
import ProtectedRoute from './service/protected_route'
function App() {
  return (
    <Routes>
      {/**Home */}
      <Route path="/" element={<Home />} />
      {/**Admin */}
      <Route path="/admin/home" element={<ProtectedRoute requiredRole="Admin"><AdminHome /></ProtectedRoute>}>      
      </Route>
    </Routes>
    
  );
}

export default App;
