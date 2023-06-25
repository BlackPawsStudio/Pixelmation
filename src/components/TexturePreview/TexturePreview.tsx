import styles from '~/components/TextureEditorArea/styles.module.css';
import { drawingStore } from '~/store/store';
import { EditorCell } from '../EditorCell';

export const TexturePreview = () => {
  const size = drawingStore((state) => state.size);
  const currentTexture = drawingStore((state) => state.currentTexture);
  const setCurrentColor = drawingStore((state) => state.setCurrentColor);

  const copyColor = (x: number, y: number) => {
    setCurrentColor(currentTexture.cells[x][y]);
  };

  return (
    <div
      className={`${styles['content']} ${styles['mini']}`}
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
              isGridVisible
              copyColor={copyColor}
            />
          );
        });
      })}
    </div>
  );
};
