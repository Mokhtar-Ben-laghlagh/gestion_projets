import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './guards/PrivateRoute';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projets from './pages/Projets';
import Phases from './pages/Phases';
import Factures from './pages/Factures';
import Organismes from './pages/Organismes';
import Employes from './pages/Employes';
import Livrables from './pages/Livrables';
import Affectations from './pages/Affectations';
import Profils from './pages/Profils';
import Documents from './pages/Documents';
import Reporting from './pages/Reporting';
import NotFound from './pages/NotFound';
import AccessDenied from './pages/AccessDenied';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />

              {/* Admin only */}
              <Route element={<PrivateRoute allowedRoles={['ADMINISTRATEUR', 'ADMIN']} />}>
                <Route path="/projets" element={<Projets />} />
                <Route path="/employes" element={<Employes />} />
                <Route path="/profil" element={<Profils />} />
              </Route>

              {/* Admin + Direction + Secrétariat */}
              <Route element={<PrivateRoute allowedRoles={['ADMINISTRATEUR', 'ADMIN', 'DIRECTEUR', 'SECRETAIRE']} />}>
                <Route path="/organismes" element={<Organismes />} />
              </Route>

              {/* Finance only */}
              <Route element={<PrivateRoute allowedRoles={['ADMINISTRATEUR', 'ADMIN', 'DIRECTEUR', 'COMPTABLE']} />}>
                <Route path="/factures" element={<Factures />} />
                <Route path="/reporting" element={<Reporting />} />
              </Route>

              {/* Operational – all authenticated users */}
              <Route path="/phases" element={<Phases />} />
              <Route path="/affectations" element={<Affectations />} />
              <Route path="/livrables" element={<Livrables />} />
              <Route path="/documents" element={<Documents />} />

              {/* Page 403 */}
              <Route path="/access-denied" element={<AccessDenied />} />

              {/* Page 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1d29',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
          }
        }}
      />
    </BrowserRouter>
  );
}

export default App;
