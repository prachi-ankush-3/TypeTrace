import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LoadingScreen from "./components/LoadingScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Test from "./pages/Test";
import Result from "./pages/Result";
import GhostRoom from "./pages/GhostRoom";
import History from "./pages/History";
import Statistics from "./pages/Statistics";
import Adventure from "./pages/Adventure";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";

function Protected({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <>
      <LoadingScreen />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth login />} />
          <Route path="/register" element={<Auth />} />

          <Route path="/test" element={<Protected><Test /></Protected>} />
          <Route path="/result" element={<Protected><Result /></Protected>} />
          <Route path="/ghost" element={<Protected><GhostRoom /></Protected>} />
          <Route path="/history" element={<Protected><History /></Protected>} />
          <Route path="/statistics" element={<Protected><Statistics /></Protected>} />
          <Route path="/adventure" element={<Protected><Adventure /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/settings" element={<Protected><Settings /></Protected>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </>
  );
}
