import { useState } from 'react';
import { drawingStore } from '~/store/store';
import { EditorCell } from '../EditorCell';
import styles from './styles.module.css';

interface TextureEditorAreaProps {
  changeInput: (x: number, y: number) => void;
}

export const TextureEditorArea = ({ changeInput }: TextureEditorAreaProps) => {
  const size = drawingStore((state) => state.size);
  const currentColor = drawingStore((state) => state.currentColor);
  const setCurrentColor = drawingStore((state) => state.setCurrentColor);
  const currentTexture = drawingStore((state) => state.currentTexture);
  const setCurrentTexture = drawingStore((state) => state.setCurrentTexture);

  const [isGridVisible, setIsGridVisible] = useState(true);

  const changeCell = (x: number, y: number) => {
    const tempCells = currentTexture.cells.concat();
    tempCells[x][y] = currentColor;
    setCurrentTexture({
      name: currentTexture.name,
      cells: tempCells,
    });
  };

  const copyColor = (x: number, y: number) => {
    setCurrentColor(currentTexture.cells[x][y]);
  };

  return (
    <>
      <label>
        <input type="checkbox" defaultChecked onChange={() => setIsGridVisible(!isGridVisible)} />{' '}
        Show grid
      </label>
      <div className={styles['content']}>
        <div
          id="contents"
          style={{
            gridTemplateColumns: `repeat(${size.width}, auto)`,
            gridTemplateRows: `repeat(${size.height}, auto)`,
          }}
        >
          {currentTexture.cells.map((row, rowId) => {
            return row.map((el, id) => {
              return (
                <EditorCell
                  key={id}
                  x={rowId}
                  y={id}
                  color={el}
                  isGridVisible={isGridVisible}
                  changeCell={changeCell}
                  copyColor={(x, y) => {
                    copyColor(x, y);
                    changeInput(x, y);
                  }}
                />
              );
            });
          })}
        </div>
      </div>
    </>
  );
};
