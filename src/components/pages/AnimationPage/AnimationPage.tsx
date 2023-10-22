import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimationEditorArea } from '~/components/AnimationEditorArea';
import { TexturePreview } from '~/components/TexturePreview';
import { drawingStore } from '~/store/store';
import { CoordinatesType } from '~/types';
import Hotkeys from 'react-hot-keys';
import styles from './styles.module.css';
import html2canvas from 'html2canvas';

export const AnimationPage = () => {
  const [currentCell, setCurrentCell] = useState<CoordinatesType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);

  const [isGridVisible, setIsGridVisible] = useState(true);

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
    const texture = currentTexture.cells.concat();
    temp.splice(
      currentSlide + 1,
      0,
      texture.map((row, rowIdx) =>
        row.map((el, idx) => (el !== 'transparent' && el !== null ? { x: rowIdx, y: idx } : null))
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
    const filename = prompt('Enter animation name', currentAnimation.name);
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
        downloadAnchorNode.setAttribute('download', filename + '.pxlma');
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }, 5);
    } else {
      alert('Incorrect name!');
    }
  };

  const exportSlideAsImage = () => {
    html2canvas(document.querySelector('#animation-contents') as HTMLElement, {
      backgroundColor: '#00000000',
    }).then((canvas) => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 3; i < image.data.length; i += 4) {
          image.data[i] = 50;
        }
        const img = canvas.toDataURL('image/png');
        const filename = `${currentAnimation.name}_slide_${currentSlide + 1}` || 'export image';
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.download = filename;
        downloadAnchorNode.href = img;
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }
      return canvas;
    });
  };

  return (
    <Hotkeys
      keyName="right, d"
      onKeyDown={() => {
        if (currentSlide + 1 !== currentAnimation.slides.length) setCurrentSlide(currentSlide + 1);
        else {
          setCurrentSlide(0);
        }
      }}
    >
      <Hotkeys
        keyName="left, a"
        onKeyDown={() => {
          if (currentSlide !== 0) setCurrentSlide(currentSlide - 1);
          else {
            setCurrentSlide(currentAnimation.slides.length - 1);
          }
        }}
      >
        <Hotkeys
          keyName="g"
          onKeyDown={() => {
            setIsGridVisible(!isGridVisible);
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
              Change background color
              <input
                type="color"
                onBlur={(e: React.ChangeEvent<HTMLInputElement>) => setBgColor(e.target.value)}
                defaultValue={bgColor}
                className={styles['bg-setup']}
              />
              Selected texture
              <TexturePreview setCurrentCell={setCurrentCell} isVisible={isGridVisible} />
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
              <button onClick={exportSlideAsImage}>Export current slide as png</button>
            </div>
            <div className={styles['content']}>
              <AnimationEditorArea
                currentCell={currentCell}
                setCurrentCell={setCurrentCell}
                isVisible={isGridVisible}
                setIsVisible={setIsGridVisible}
              />
            </div>
            <div className={styles['slides']}>
              <div className={styles['slides-select']}>
                <button
                  onClick={() => {
                    if (currentSlide !== 0) setCurrentSlide(currentSlide - 1);
                    else {
                      setCurrentSlide(currentAnimation.slides.length - 1);
                    }
                  }}
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
                  onClick={() => {
                    if (currentSlide + 1 !== currentAnimation.slides.length)
                      setCurrentSlide(currentSlide + 1);
                    else {
                      setCurrentSlide(0);
                    }
                  }}
                  className={styles['slide-button']}
                  style={{
                    fontSize: 'large',
                    background: 'none',
                    border: 'none',
                  }}
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
    </Hotkeys>
  );
};
