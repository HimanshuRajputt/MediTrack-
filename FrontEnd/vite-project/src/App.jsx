import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Medications from "./pages/Medications"; // ✅ Import Medications page
import Prescriptions from "./pages/Prescriptions";
import {AuthProvider,AuthContext} from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
// import Dashboard from "../src/pages/Dashboard"
import AdminPanel from "./pages/AdminPanel";
// import OneSignalSetup from "./services/OneSignalSetup";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      {/* <OneSignalSetup/> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-dashboard" element={<AdminPanel />} />
        <Route
          path="/medications"
          element={
            // <PrivateRoute>
              <Medications />
            // </PrivateRoute>
          }
        />
        <Route
          path="/prescriptions"
          element={
            <PrivateRoute>
              <Prescriptions />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
