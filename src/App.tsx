import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./layout/MainLayout"
import Index from "./pages/Index"
import { Form } from "./pages/form/form";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/form" element={<Form />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
