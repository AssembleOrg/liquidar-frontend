import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './presentation/components/ThemeProvider';
import LoginPage from './presentation/pages/LoginPage';
import HomePage from './presentation/pages/HomePage';
import ProtectedRoute from './presentation/components/ProtectedRoute';
import ConfigPage from './presentation/pages/ConfigPage';
import ProfilePage from './presentation/pages/ProfilePage';
import FacturamaPage from './presentation/pages/FacturamaPage';
import FacturadoresPage from './presentation/pages/FacturadoresPage';
import RegisterPage from './presentation/pages/RegisterPage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configuracion"
            element={
                <ConfigPage />
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/facturama"
            element={
              <ProtectedRoute>
                <FacturamaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/facturadores"
            element={
              <ProtectedRoute>
                <FacturadoresPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
