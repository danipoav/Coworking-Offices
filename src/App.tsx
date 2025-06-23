import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Index from "./pages/Index";
import { FormSuscribe } from "./pages/formSuscribe";
import { FormUnsuscribe } from "./pages/formUnsuscribe";
import Inactivos from "./pages/Inactivos";
import PendientesPago from "./pages/PendientesPago";
import Login from "./pages/login";
import Register from "./pages/register";
import { PrivateRoute } from "./components/PrivateRoute";
import { AuthProvider } from "./common/AuthContext";

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
            <Route path="/formsuscribe" element={<FormSuscribe />} />
            <Route path="/formunsuscribe" element={<FormUnsuscribe />} />
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
    </AuthProvider>
  );
}

export default App;
