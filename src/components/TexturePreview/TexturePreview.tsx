import styles from './styles.module.css';
import { drawingStore } from '~/store/store';
import { CoordinatesType } from '~/types';
import { EditorCell } from '../EditorCell';

interface TexturePreviewProps {
  setCurrentCell: ({ x, y }: CoordinatesType) => void;
  isVisible: boolean;
}

export const TexturePreview = ({ setCurrentCell, isVisible }: TexturePreviewProps) => {
  const size = drawingStore((state) => state.size);
  const currentTexture = drawingStore((state) => state.currentTexture);

  const copyColor = (x: number, y: number) => {
    setCurrentCell({ x: x, y: y });
  };

  return (
    <div
      className={styles['content']}
      style={{
        gridTemplateColumns: `repeat(${size.width}, auto)`,
        gridTemplateRows: `repeat(${size.height}, auto)`,
      }}
    >
      {currentTexture.cells.map((row, rowId) => {
        return row.map((el, id) => {
          return (
            <EditorCell isSmall key={id} x={rowId} y={id} color={el} isGridVisible={isVisible} copyColor={copyColor} />
          );
        });
      })}
    </div>
  );
};
