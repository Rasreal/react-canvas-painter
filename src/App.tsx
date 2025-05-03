import React, { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Canvas } from "./components/Canvas";
import { Goo } from "./components/Goo";
import { Intro } from "./components/Intro";
import { Toolbar } from "./components/Toolbar";
import { usePainter } from "./hooks/usePainter";
import Home from "@/pages/HomePage/HomePage";



const About = () => (
  <div style={{ padding: "2rem" }}>
    <h1>About This App</h1>
    <p>This is a drawing app built with React and React Router.</p>
  </div>
);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </BrowserRouter>
);

export default App;
