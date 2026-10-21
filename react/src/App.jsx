import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import BackendMainLayout from "./layouts/BackendMainLayout";
import Dashboard from "./pages/backend/Dashboard";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Index from "./pages/frontend/Index";
import TemplateCreate from "./pages/backend/Template/TemplateCreate";
import TemplateEditor from "./pages/backend/Template/TemplateEditor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All frontend routes handled inside Index */}
        <Route path="/*" element={<Index />} />

        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<BackendMainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create/template" element={<TemplateCreate />} />
            <Route path="/template/:id/edit" element={<TemplateEditor />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
