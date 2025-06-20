import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./layout/MainLayout"
import Index from "./pages/Index"
import { FormSuscribe } from "./pages/formSuscribe/formSuscribe"
import { FormUnsuscribe } from "./pages/formUnsuscribe/formUnsuscribe"
import Inactivos from "./pages/Inactivos"
import PendientesPago from "./pages/PendientesPago"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/formsuscribe" element={<FormSuscribe />} />
          <Route path="/formunsuscribe" element={<FormUnsuscribe />} />
          <Route path="/inactive" element={<Inactivos />} />
          <Route path="/pending" element={<PendientesPago />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
