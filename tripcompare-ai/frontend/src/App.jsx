import { Navigate, Route, Routes } from "react-router-dom";
import AgentPage from "./pages/AgentPage";
import AIFeaturesPage from "./pages/AIFeaturesPage";
import ChatbotWidget from "./components/ChatbotWidget";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import DestinationDetailsPage from "./pages/DestinationDetailsPage";
import DestinationsPage from "./pages/DestinationsPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SignupPage from "./pages/SignupPage";

const App = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ai-features" element={<AIFeaturesPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destination/:name" element={<DestinationDetailsPage />} />
        <Route
          path="/agent"
          element={
            <ProtectedRoute>
              <AgentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planner"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <ChatbotWidget />
    </div>
  );
};

export default App;
