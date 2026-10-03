import { BrowserRouter, Route, Routes } from "react-router";
import ErrorBoundary from "./apps/admin-panel/shared/components/ErrorBoundary";
import AdminPanelRoutes from "./apps/admin-panel/AdminPanelRoutes";
import { AuthProvider } from "./store/AuthContext";

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<AdminPanelRoutes />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
