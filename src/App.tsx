import { Routes, Route, useNavigate } from 'react-router-dom';
import { AnimationPage } from './components/pages/AnimationPage';
import { FieldSelector } from './components/pages/FieldSelector';
import { FileSelectPage } from './components/pages/FileSelectPage';
import { NotFoundPage } from './components/pages/NotFoundPage';
import { TexturePage } from './components/pages/TexturePage';
import { drawingStore } from './store/store';

const App = () => {
  const navigate = useNavigate();

  const bgColor = drawingStore((state) => state.bgColor);

  const setIsMouseDown = drawingStore((state) => state.setIsMouseDown);

  return (
    <main
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      style={{
        backgroundColor: bgColor,
      }}
    >
      <header>
        <h1
          onClick={() => {
            const isSure = confirm(
              'You sure you want to go to main page? (this will reset all unsaved progress)'
            );
            if (isSure) navigate('/');
          }}
        >
          PixelMation
        </h1>
      </header>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<FieldSelector />} />
        <Route path="/texture" element={<TexturePage />} />
        <Route path="/file-select" element={<FileSelectPage />} />
        <Route path="/animation" element={<AnimationPage />} />
      </Routes>
    </main>
  );
};

export default App;
