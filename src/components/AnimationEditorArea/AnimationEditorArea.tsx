import { useEffect, useRef, useState } from 'react';
import { drawingStore } from '~/store/store';
import { CoordinatesType } from '~/types';
import { EditorCell } from '../EditorCell';
import styles from './styles.module.css';

interface AnimationEditorAreaProps {
  currentCell: CoordinatesType | null;
  setCurrentCell: ({ x, y }: CoordinatesType) => void;
}

export const AnimationEditorArea = ({ currentCell, setCurrentCell }: AnimationEditorAreaProps) => {
  const size = drawingStore((state) => state.size);
  const currentSlide = drawingStore((state) => state.currentSlide);
  const currentAnimation = drawingStore((state) => state.currentAnimation);
  const setCurrentAnimation = drawingStore((state) => state.setCurrentAnimation);
  const currentTexture = drawingStore((state) => state.currentTexture);

  const [isGridVisible, setIsGridVisible] = useState(true);

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
    setCurrentCell({ x: x, y: y });
  };

  useEffect(() => {
    // console.log(currentAnimation.slides );
  }, [currentAnimation]);

  return (
    <>
      <label>
        <input type="checkbox" defaultChecked onChange={() => setIsGridVisible(!isGridVisible)} />{' '}
        Show grid
      </label>
      <div
        ref={areaRef}
        className={styles['content']}
        style={{
          gridTemplateColumns: `repeat(${size.width}, auto)`,
          gridTemplateRows: `repeat(${size.height}, auto)`,
        }}
      >
        {currentAnimation.slides.length &&
          currentAnimation.slides[currentSlide].map((row, rowId) =>
            row.map((el, id) => (
              <EditorCell
                key={id}
                x={rowId}
                y={id}
                color={el ? currentTexture.cells[el.x][el.y] : 'transparent'}
                isGridVisible={isGridVisible}
                changeCell={changeCell}
                copyColor={copyColor}
              />
            ))
          )}
      </div>
    </>
  );
};
