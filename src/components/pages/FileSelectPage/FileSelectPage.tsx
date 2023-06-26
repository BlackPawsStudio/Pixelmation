import styles from './styles.module.css';
import { useRef } from 'react';
import { drawingStore } from '~/store/store';
import { useNavigate } from 'react-router-dom';
import { CoordinatesType } from '~/types';

export const FileSelectPage = () => {
  const setSize = drawingStore((state) => state.setSize);
  const setCurrentTexture = drawingStore((state) => state.setCurrentTexture);
  const setCurrentAnimation = drawingStore((state) => state.setCurrentAnimation);

  const navigate = useNavigate();

  const textureInputFile = useRef<HTMLInputElement>(null);
  const animationInputFile = useRef<HTMLInputElement>(null);

  const importTextureFile = () => {
    if (textureInputFile.current) {
      textureInputFile.current.click();
    }
  };

  const importAnimationFile = () => {
    if (animationInputFile.current) {
      animationInputFile.current.click();
    }
  };

  const handleTextureFileData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length === 1) {
      if (e.target.files[0]) {
        const file = e.target.files[0];
        if (file.type === 'application/json') {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target && e.target.result) {
              const fileData = JSON.parse(e.target.result as string);
              setSize({
                width: fileData.cells[0].length,
                height: fileData.cells.length,
              });
              setCurrentTexture(fileData);
              const blankAnimation: (CoordinatesType | null)[][][] = new Array(1)
                .fill(null)
                .map(() =>
                  new Array(fileData.cells.length)
                    .fill(null)
                    .map(() => new Array(fileData.cells[0].length).fill(null))
                );
              setCurrentAnimation({ name: '', slides: blankAnimation });
              navigate('/animation');
            }
          };
          reader.readAsText(file);
        } else {
          alert('File selected incorrectly');
        }
      }
    } else {
      alert('File selected incorrectly');
    }
  };

  const handleAnimationFileData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length === 1) {
      if (e.target.files[0]) {
        const file = e.target.files[0];
        if (file.type === 'application/json') {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target && e.target.result) {
              const fileData = JSON.parse(e.target.result as string);
              navigate('/animation');
            }
          };
          reader.readAsText(file);
        } else {
          alert('File selected incorrectly');
        }
      }
    } else {
      alert('File selected incorrectly');
    }
  };

  return (
    <div className={styles['container']}>
      <div className={styles['button']}>
        <button onClick={importTextureFile}>
          Load texture
          <input
            type="file"
            id="file"
            ref={textureInputFile}
            style={{ display: 'none' }}
            onChange={handleTextureFileData}
          />
        </button>
      </div>
      <div className={styles['button']}>
        <button onClick={importAnimationFile}>
          Load animation
          <input
            type="file"
            id="file"
            ref={animationInputFile}
            style={{ display: 'none' }}
            onChange={handleAnimationFileData}
          />
        </button>
      </div>
    </div>
  );
};
