import { useEffect, useRef } from 'react';
import { drawingStore } from '~/store/store';
import { CoordinatesType } from '~/types';
import { EditorCell } from '../EditorCell';
import styles from './styles.module.css';

interface AnimationEditorAreaProps {
  currentCell: CoordinatesType | null;
  setCurrentCell: (data: CoordinatesType | null) => void;
  isVisible: boolean;
  setIsVisible: (b: boolean) => void;
}

export const AnimationEditorArea = ({
  currentCell,
  setCurrentCell,
  isVisible,
  setIsVisible,
}: AnimationEditorAreaProps) => {
  const size = drawingStore((state) => state.size);
  const currentSlide = drawingStore((state) => state.currentSlide);
  const currentAnimation = drawingStore((state) => state.currentAnimation);
  const setCurrentAnimation = drawingStore((state) => state.setCurrentAnimation);
  const currentTexture = drawingStore((state) => state.currentTexture);

  const changeCell = (x: number, y: number) => {
    const temp = currentAnimation.slides.concat();
    temp[currentSlide][x][y] = currentCell
      ? {
          x: currentCell.x,
          y: currentCell.y,
        }
      : null;
    setCurrentAnimation({
      name: currentAnimation.name,
      slides: temp,
    });
  };

  const areaRef = useRef<HTMLDivElement | null>(null);

  const copyColor = (x: number, y: number) => {
    setCurrentCell(currentAnimation.slides[currentSlide][x][y]);
  };

  useEffect(() => {
    // console.log(currentAnimation.slides );
  }, [currentAnimation]);

  return (
    <>
      <label>
        <input type="checkbox" checked={isVisible} onChange={() => setIsVisible(!isVisible)} /> Show
        grid
      </label>
      <div
        ref={areaRef}
        className={styles['content']}
        style={{
          gridTemplateColumns: `repeat(${size.width}, auto)`,
          gridTemplateRows: `repeat(${size.height}, auto)`,
        }}
        id={'animation-contents'}
      >
        {currentAnimation.slides.length &&
          currentAnimation.slides[currentSlide].map((row, rowId) =>
            row.map((el, id) => (
              <EditorCell
                key={id}
                x={rowId}
                y={id}
                color={el ? currentTexture.cells[el.x][el.y] : 'transparent'}
                isGridVisible={isVisible}
                changeCell={changeCell}
                copyColor={copyColor}
              />
            ))
          )}
      </div>
    </>
  );
};
