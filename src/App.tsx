import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import Home from './pages/Home.tsx';
import CargoDetails from './pages/CargoDetails.tsx';
import ContainerDetails from './pages/ContainerDetails.tsx';
import PackageDetails from './pages/PackageDetails.tsx';
import CarDetails from './pages/CarDetails.tsx';
import TrackingDashboard from './pages/TrackingDashboard.tsx';
import Search from './pages/Search.tsx';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/tracking" element={<TrackingDashboard />} />
            <Route path="/search" element={<Search />} />

            {/* Tracking Routes */}
            <Route path="/cargo" element={<CargoDetails />} />
            <Route path="/cargo/:id" element={<CargoDetails />} />
            <Route path="/container" element={<ContainerDetails />} />
            <Route path="/container/:id" element={<ContainerDetails />} />
            <Route path="/package" element={<PackageDetails />} />
            <Route path="/package/:id" element={<PackageDetails />} />
            <Route path="/car" element={<CarDetails />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/route/:id" element={<CarDetails />} />

            {/* Footer Routes */}
            <Route path="/about" element={<Home />} />
            <Route path="/careers" element={<Home />} />
            <Route path="/contact" element={<Home />} />
            <Route path="/help" element={<Home />} />
            <Route path="/faq" element={<Home />} />
            <Route path="/privacy" element={<Home />} />
            <Route path="/terms" element={<Home />} />

            {/* Fallback Route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <ChatBot />
      </div>
    </Router>
  );
}

export default App;
