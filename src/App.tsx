import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./layout/MainLayout"
import Index from "./pages/Index"
import Inactivos from "./pages/Inactivos"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/inactivos" element={<Inactivos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
