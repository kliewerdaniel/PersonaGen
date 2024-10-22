// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UploadSample from './components/UploadSample';
import PersonaList from './components/PersonaList';
import GenerateContent from './components/GenerateContent';
import BlogPosts from './components/BlogPosts';

const App: React.FC = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Upload Sample</Link>
          </li>
          <li>
            <Link to="/personas">Personas</Link>
          </li>
          <li>
            <Link to="/blog-posts">Blog Posts</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<UploadSample />} />
        <Route path="/personas" element={<PersonaList />} />
        <Route path="/generate" element={<GenerateContent />} />
        <Route path="/blog-posts" element={<BlogPosts />} />
      </Routes>
    </Router>
  );
};

export default App;
