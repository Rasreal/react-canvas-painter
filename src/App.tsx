import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "@/pages/HomePage/HomePage";
import About from "@/pages/AboutPage/AboutPage";
import Paint from "./pages/PaintPage/PaintPage";
import { AnimatePresence } from "framer-motion";

const App = () => {

  const location = useLocation();

  return (
    <AnimatePresence mode = "wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/paint" element={<Paint />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </AnimatePresence>
  )
};

export default App;
