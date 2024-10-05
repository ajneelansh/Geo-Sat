import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Maintool from './components/Maintool';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path= '/Maintool'element ={<Maintool /> }/>
      </Routes>
    </Router>
  );
}

export default App;