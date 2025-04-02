import React from "react";
import { Route, Routes } from "react-router-dom";

//Importing all items
import Navbar from "./components/navbar/Navabr";
import Footer from "./components/footer/Footer";
import LandingPage from "./pages/LandingPage";
import Contact from "./pages/ContactUs";
import Admin from "./components/Admin/Admin";
import Home from "./pages/Home";
import Form from "./pages/upload_form";
import Testimonials from "./pages/testimonials";
import Aboutus from "./pages/aboutus";
import KnowMore from "./pages/KnowMore";
import Signin from "./components/SignIn/Signin";
import Profile from "./pages/profile";
import Imggg from "./pages/img";
import SavedItems from "./pages/SavedItems";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import BecomePartner from "./pages/BecomePartner";
import RefundPolicy from "./pages/RefundPolicy";
import TestAuth from "./pages/TestAuth";

import { AuthProvider } from "./Contexts/AuthContext";
import { ThemeProvider } from "./Contexts/ThemeContext";
import { useTheme } from "./Contexts/ThemeContext";

// Main container that applies theme styles
const ThemedApp = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`app-container flex flex-col min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      <Navbar />
      <div className="main-content-wrapper flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/knowmore" element={<KnowMore />} />
          <Route path="/form" element={<Form />} />
          <Route path="/img" element={<Imggg />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Signin" element={<Signin />} />
          <Route path="/saved-items" element={<SavedItems />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/partners" element={<BecomePartner />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/test-auth" element={<TestAuth />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemedApp />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
