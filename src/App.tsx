import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Index from "./pages/Index";
import { FormActive } from "./pages/formActive";
import { FormInactive } from "./pages/formInactive";
import { FormSuscribe } from "./pages/formSuscribe";
import Inactivos from "./pages/Inactivos";
import PendientesPago from "./pages/PendientesPago";
import Login from "./pages/login";
import Register from "./pages/register";
import { PrivateRoute } from "./components/PrivateRoute";
import { AuthProvider } from "./common/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<MainLayout />}>
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Index />
                </PrivateRoute>
              }
            />
            <Route path="/formActive" element={<FormActive />} />
            <Route path="/formInactive" element={<FormInactive />} />
            <Route path="/formSuscribe" element={<FormSuscribe />} />
            <Route
              path="/inactive"
              element={
                <PrivateRoute>
                  <Inactivos />
                </PrivateRoute>
              }
            />
            <Route
              path="/pending"
              element={
                <PrivateRoute>
                  <PendientesPago />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
