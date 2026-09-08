import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import TechnicalDebt from './pages/TechnicalDebt';
import Predictions from './pages/Predictions';
import Priorities from './pages/Priorities';
import Hotspots from './pages/Hotspots';
import FileIntelligence from './pages/FileIntelligence';
import Copilot from './pages/Copilot';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/debt" element={<TechnicalDebt />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/priorities" element={<Priorities />} />
          <Route path="/hotspots" element={<Hotspots />} />
          <Route path="/files/:id" element={<FileIntelligence />} />
          <Route path="/copilot" element={<Copilot />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
