import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Parameters from './Components/Parametres/Parameters'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageHome from './pages/Home/PageHome'
import PageParam from './pages/Problem1/PageParam'
import PageProb2 from './pages/Problem2/PageProb2'







function App() {
  

  return (
    <> 
      
      <Router>
      <Routes>
        <Route path="/" element={<PageHome />} />
        <Route path="/Problem1" element={<PageParam />} />
        <Route path="/Problem2" element={<PageProb2/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
