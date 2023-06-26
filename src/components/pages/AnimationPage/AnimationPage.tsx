import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimationEditorArea } from '~/components/AnimationEditorArea';
import { TexturePreview } from '~/components/TexturePreview';
import { drawingStore } from '~/store/store';
import { CoordinatesType } from '~/types';
import styles from './styles.module.css';

export const AnimationPage = () => {
  const [currentCell, setCurrentCell] = useState<CoordinatesType | null>(null);

  const currentTexture = drawingStore((state) => state.currentTexture);
  const currentAnimation = drawingStore((state) => state.currentAnimation);
  const setCurrentAnimation = drawingStore((state) => state.setCurrentAnimation);
  const currentSlide = drawingStore((state) => state.currentSlide);
  const setCurrentSlide = drawingStore((state) => state.setCurrentSlide);

  const navigate = useNavigate();

  useEffect(() => {
    if (currentTexture.cells.length === 0) {
      navigate('/file-select');
    }
  }, [currentTexture]);

  const addSlide = () => {
    const temp = currentAnimation.slides.concat();
    temp.splice(currentSlide + 1, 0,
      new Array(currentTexture.cells.length)
        .fill(null)
        .map(() => new Array(currentTexture.cells[0].length).fill(null))
    );

    setCurrentAnimation({
      name: currentAnimation.name,
      slides: temp,
    });
  };

  const removeSlide = () => {
    const temp = currentAnimation.slides.concat();
    
    temp.splice(currentSlide, 1);

    setCurrentAnimation({
      name: currentAnimation.name,
      slides: temp,
    });
  }

  // const exportFile = () => {
  //   const filename = prompt('Enter texture name');
  //   if (filename !== null) {
  //     setCurrentTexture({
  //       name: filename,
  //       cells: currentTexture.cells,
  //     });
  //     setTimeout(() => {
  //       currentTexture.name = filename;
  //       const dataStr =
  //         'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentTexture));
  //       const downloadAnchorNode = document.createElement('a');
  //       downloadAnchorNode.setAttribute('href', dataStr);
  //       downloadAnchorNode.setAttribute('download', filename + '_texture.json');
  //       downloadAnchorNode.click();
  //       downloadAnchorNode.remove();
  //     }, 5);
  //   }
  // };

  return (
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
        <button>Save and export</button>
        Selected texture
        <TexturePreview setCurrentCell={setCurrentCell} />
      </div>
      <div className={styles['content']}>
        <div className={styles['slides']}>
          <button
            disabled={currentSlide === 0}
            onClick={() => setCurrentSlide(currentSlide - 1)}
            className={styles['slide-button']}
            style={{
              fontSize: 'large',
            }}
          >
            {'<'}
          </button>
          {currentSlide + 1}
          <button
            onClick={() => setCurrentSlide(currentSlide + 1)}
            className={styles['slide-button']}
            style={{
              fontSize: 'large',
            }}
            disabled={currentSlide + 1 === currentAnimation.slides.length}
          >
            {'>'}
          </button>
          <button onClick={addSlide} className={styles['slide-button']}>
            Add next slide
          </button>
          <button onClick={removeSlide} className={styles['slide-button']}>
            Delete current slide
          </button>
        </div>
        <AnimationEditorArea currentCell={currentCell} setCurrentCell={setCurrentCell} />
      </div>
    </div>
  );
};
