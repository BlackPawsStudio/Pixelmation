import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimationEditorArea } from '~/components/AnimationEditorArea';
import { TexturePreview } from '~/components/TexturePreview';
import { drawingStore } from '~/store/store';
import { CoordinatesType } from '~/types';
import Hotkeys from 'react-hot-keys';
import styles from './styles.module.css';

export const AnimationPage = () => {
  const [currentCell, setCurrentCell] = useState<CoordinatesType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);

  const currentTexture = drawingStore((state) => state.currentTexture);
  const currentAnimation = drawingStore((state) => state.currentAnimation);
  const setCurrentAnimation = drawingStore((state) => state.setCurrentAnimation);
  const currentSlide = drawingStore((state) => state.currentSlide);
  const setCurrentSlide = drawingStore((state) => state.setCurrentSlide);
  const bgColor = drawingStore((state) => state.bgColor);
  const setBgColor = drawingStore((state) => state.setBgColor);

  const navigate = useNavigate();

  useEffect(() => {
    if (currentTexture.cells.length === 0) {
      navigate('/file-select');
    }
  }, [currentTexture]);

  const addSlide = () => {
    const temp = currentAnimation.slides.concat();
    temp.splice(
      currentSlide + 1,
      0,
      new Array(currentTexture.cells.length)
        .fill(null)
        .map(() => new Array(currentTexture.cells[0].length).fill(null))
    );

    setCurrentAnimation({
      name: currentAnimation.name,
      slides: temp,
    });
    setCurrentSlide(currentSlide + 1);
  };

  const copySlide = () => {
    const temp = currentAnimation.slides.concat();
    temp.splice(
      currentSlide + 1,
      0,
      new Array(currentTexture.cells.length)
        .fill(null)
        .map((_, rowIdx) =>
          new Array(currentTexture.cells[0].length)
            .fill(null)
            .map((_, idx) => currentAnimation.slides[currentSlide][rowIdx][idx])
        )
    );

    setCurrentAnimation({
      name: currentAnimation.name,
      slides: temp,
    });
    setCurrentSlide(currentSlide + 1);
  };

  const insertTexture = () => {
    const temp = currentAnimation.slides.concat();
    temp.splice(
      currentSlide + 1,
      0,
      new Array(currentTexture.cells.length)
        .fill(null)
        .map((_, rowIdx) =>
          new Array(currentTexture.cells[0].length)
            .fill(null)
            .map((el, idx) => (el !== 'transparent' ? { x: rowIdx, y: idx } : null))
        )
    );

    setCurrentAnimation({
      name: currentAnimation.name,
      slides: temp,
    });
    setCurrentSlide(currentSlide + 1);
  };

  const removeSlide = () => {
    const isSure = confirm('Are you sure?');
    if (isSure && currentAnimation.slides.length > 1) {
      const temp = currentAnimation.slides.concat();

      temp.splice(currentSlide, 1);

      setCurrentAnimation({
        name: currentAnimation.name,
        slides: temp,
      });
      if (currentSlide !== 0) setCurrentSlide(currentSlide - 1);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1 === currentAnimation.slides.length ? 0 : currentSlide + 1);
      }, speed);
    }
  }, [isPlaying, currentSlide]);

  const exportFile = () => {
    const filename = prompt('Enter animation name');
    if (filename !== null) {
      setCurrentAnimation({
        name: filename,
        slides: currentAnimation.slides,
      });
      setTimeout(() => {
        const dataStr =
          'data:text/json;charset=utf-8,' +
          encodeURIComponent(
            JSON.stringify({
              name: filename,
              slides: currentAnimation.slides,
              texture: currentTexture,
            })
          );
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', filename + '_animation.json');
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }, 5);
    } else {
      alert('Incorrect name!');
    }
  };

  return (
    <Hotkeys
      keyName="right, d"
      onKeyDown={() => {
        if (currentSlide + 1 !== currentAnimation.slides.length) setCurrentSlide(currentSlide + 1);
      }}
    >
      <Hotkeys
        keyName="left, a"
        onKeyDown={() => {
          if (currentSlide !== 0) setCurrentSlide(currentSlide - 1);
        }}
      >
        <div className={styles['container']}>
          <div className={styles['config']}>
            <div>{currentAnimation.name}</div>
            Current color
            <div
              className={styles['color']}
              style={{
                background: currentCell
                  ? currentTexture.cells[currentCell.x][currentCell.y]
                  : 'transparent',
              }}
            />
            <button onClick={() => setCurrentCell(null)}>Click to set to empty</button>
            Background color
            <input
              type="color"
              onBlur={(e: React.ChangeEvent<HTMLInputElement>) => setBgColor(e.target.value)}
              defaultValue={bgColor}
            />
            Selected texture
            <TexturePreview setCurrentCell={setCurrentCell} />
            Animation speed ({speed}ms)
            <input
              type="range"
              min={50}
              max={1000}
              step={50}
              defaultValue={speed}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => setSpeed(+e.target.value)}
            />
            <button onClick={exportFile}>Save and export</button>
          </div>
          <div className={styles['content']}>
            <AnimationEditorArea currentCell={currentCell} setCurrentCell={setCurrentCell} />
          </div>
          <div className={styles['slides']}>
            <div className={styles['slides-select']}>
              <button
                disabled={currentSlide === 0}
                onClick={() => setCurrentSlide(currentSlide - 1)}
                className={styles['slide-button']}
                style={{
                  fontSize: 'large',
                  background: 'none',
                  border: 'none',
                }}
              >
                {'<'}
              </button>
              {currentSlide + 1} / {currentAnimation.slides.length}
              <button
                onClick={() => setCurrentSlide(currentSlide + 1)}
                className={styles['slide-button']}
                style={{
                  fontSize: 'large',
                  background: 'none',
                  border: 'none',
                }}
                disabled={currentSlide + 1 === currentAnimation.slides.length}
              >
                {'>'}
              </button>
            </div>
            <button onClick={addSlide} className={styles['slide-button']}>
              Add next slide
            </button>
            <button onClick={copySlide} className={styles['slide-button']}>
              Copy this slide
            </button>
            <button onClick={insertTexture} className={styles['slide-button']}>
              Insert texture as new slide
            </button>
            <button onClick={removeSlide} className={styles['slide-button']}>
              Delete current slide
            </button>
            <button className={styles['slide-button']} onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? 'Stop' : 'Play'}
            </button>
          </div>
        </div>
      </Hotkeys>
    </Hotkeys>
  );
};
