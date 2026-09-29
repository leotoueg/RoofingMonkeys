import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BookingPage from "./pages/BookingPage";
import { Toaster } from "./components/ui/sonner";
import { VARIANTS } from "./lib/serviceVariants";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* General roofing landing page (default) */}
          <Route path="/" element={<LandingPage variant={VARIANTS.general} />} />

          {/* Service-specific Google Ads landing pages */}
          <Route path="/shingles" element={<LandingPage variant={VARIANTS.shingles} />} />
          <Route path="/flat-roofs" element={<LandingPage variant={VARIANTS.flatRoofs} />} />
          <Route path="/soffit-fascia-gutters" element={<LandingPage variant={VARIANTS.soffit} />} />
          <Route path="/emergency-repairs" element={<LandingPage variant={VARIANTS.emergency} />} />
          <Route path="/storm-damage-repair" element={<LandingPage variant={VARIANTS.stormDamage} />} />

          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
