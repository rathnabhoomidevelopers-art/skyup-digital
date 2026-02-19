// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext"; // ADD THIS IMPORT
// import { ProtectedRoute } from "./components/ProtectedRoute"; // ADD THIS IMPORT
// import Header from "./components/Header";
// import HeroSection from "./components/HeroSection";
// import Carousel from "./components/Carousel";
// import OurClientsSection from "./components/OurClientsSection";
// import Footer from "./components/Footer";
// import WhatMakesUsDifferentSection from "./components/WhatMakesUsDifferentSection";
// import FAQSection from "./components/FAQSection";
// import ServiceCardsSection from "./components/ServiceCardsSection";
// import BlogsContainer from "./components/BlogsContainer";
// import { HomePage } from "./pages/HomePage";
// import { AboutUS } from "./pages/AboutUS";
// import { Service } from "./pages/Service";
// import { Blogs } from "./pages/Blogs";
// import BlogDetail from "./pages/BlogDetail";
// import ContactCTAContainer from "./components/ContactCTAContainer";
// import { Careers } from "./pages/Careers";
// import { ContactUs } from "./pages/ContactUs";
// import JobApplicationForm from "./components/JobApplicationForm";
// import WhatWeDoSection from "./components/WhatWeDoSection";
// import SubServicePage from "./pages/SubServicePage";
// import JourneySection from "./components/JourneySection";
// import WhyTrustSection from "./components/WhyTrustSection";
// import OurTeamSection from "./components/OurTeamSection";
// import TestimonialsSection from "./components/TestimonialsSection";
// import TermsCondition from "./pages/Terms&Condition";
// import PrivacyPolicy from "./pages/PrivacyPolicy";
// import ScrollToTop from "./components/ScrollToTop";
// import ThankYou from "./components/ThankYou";
// import DynamicBlog from "./pages/DynamicBlog";
// import { Receipt } from "./pages/Receipt";
// import { Login } from "./components/Login";

// function App() {
//   return (
//     <AuthProvider>
//       {" "}
//       {/* WRAP EVERYTHING WITH AuthProvider */}
//       <ScrollToTop />
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<HomePage />} />
//         <Route path="/aboutus" element={<AboutUS />} />
//         <Route path="/service" element={<Service />} />
//         <Route path="/service/category/:categorySlug" element={<Service />} />
//         <Route path="/homepage" element={<HomePage />} />
//         <Route path="/blogs" element={<Blogs />} />
//         <Route path="/blogscontainer" element={<BlogsContainer />} />
//         <Route path="/blog/:slug" element={<BlogDetail />} />
//         <Route path="/header" element={<Header />} />
//         <Route path="/herosection" element={<HeroSection />} />
//         <Route path="/carousel" element={<Carousel />} />
//         <Route path="/ourclientsection" element={<OurClientsSection />} />
//         <Route path="/footer" element={<Footer />} />
//         <Route
//           path="/whatmakesusdifferentsection"
//           element={<WhatMakesUsDifferentSection />}
//         />
//         <Route path="/faqsection" element={<FAQSection />} />
//         <Route path="/servicecardssection" element={<ServiceCardsSection />} />
//         <Route path="/contactctacontainer" element={<ContactCTAContainer />} />
//         <Route path="/careers" element={<Careers />} />
//         <Route path="/contactus" element={<ContactUs />} />
//         <Route path="/jobapplicationform" element={<JobApplicationForm />} />
//         <Route path="/whatwedosection" element={<WhatWeDoSection />} />
//         <Route path="/services/:slug" element={<SubServicePage />} />
//         <Route path="/journeysection" element={<JourneySection />} />
//         <Route path="/whytrustsection" element={<WhyTrustSection />} />
//         <Route path="/ourteamsection" element={<OurTeamSection />} />
//         <Route path="/testimonialssection" element={<TestimonialsSection />} />
//         <Route path="/termscondition" element={<TermsCondition />} />
//         <Route path="/privacypolicy" element={<PrivacyPolicy />} />
//         <Route path="/thankyou" element={<ThankYou />} />
//         <Route path="/dynamicblog" element={<DynamicBlog />} />
//         {/* Admin Login Route (Public) */}
//         <Route path="/admin/login" element={<Login />} />
//         {/* Protected Admin Routes */}
//         <Route path="/admin/receipt" element={ <ProtectedRoute> <Receipt /> </ProtectedRoute> } />
//         {/* Keep old /receipt route for backward compatibility but redirect to admin */}
//         <Route path="/receipt" element={<Navigate to="/admin/receipt" replace />} />
//         <Route path="/login" element={<Navigate to="/admin/login" replace />} />
//       </Routes>
//     </AuthProvider>
//   );
// }

// export default App;
