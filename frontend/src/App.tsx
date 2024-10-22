import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadSample from './components/UploadSample';
import PersonaList from './components/PersonaList';
import GenerateContent from './components/GenerateContent';
import BlogPosts from './components/BlogPosts';

import NavBar from './components/NavBar';

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<UploadSample />} />
          <Route path="/personas" element={<PersonaList />} />
          <Route path="/generate" element={<GenerateContent />} />
          <Route path="/blog-posts" element={<BlogPosts />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
