import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./layout/MainLayout"
import Index from "./pages/Index"
import { FormRegister } from "./pages/formRegister/formRegister";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/formregister" element={<FormRegister />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
