import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { App } from "@/App";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* Weitere Routen: path="link/:id" usw. */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
