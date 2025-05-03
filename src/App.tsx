import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "@/pages/HomePage/HomePage";
import About from "@/pages/AboutPage/AboutPage";


const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </BrowserRouter>
);

export default App;
