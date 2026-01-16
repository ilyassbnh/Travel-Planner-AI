import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TripDetail from './pages/TripDetail'; // <--- Import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* La route dynamique avec :id */}
        <Route path="/trip/:id" element={<TripDetail />} /> 
      </Routes>
    </Router>
  );
}

export default App;
