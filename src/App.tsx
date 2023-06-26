import { Routes, Route, useNavigate } from 'react-router-dom';
import { AnimationPage } from './components/pages/AnimationPage';
import { FieldSelector } from './components/pages/FieldSelector';
import { FileSelectPage } from './components/pages/FileSelectPage';
import { TexturePage } from './components/pages/TexturePage';

const App = () => {
  const navigate = useNavigate();

  return (
    <main>
      <header>
        <h1 onClick={() => navigate('/')}>PixelMation</h1>
      </header>
      <Routes>
        <Route path="/" element={<FieldSelector />} />
        <Route path="/texture" element={<TexturePage />} />
        <Route path="/file-select" element={<FileSelectPage />} />
        <Route path="/animation" element={<AnimationPage />} />
      </Routes>
    </main>
  );
};

export default App;
