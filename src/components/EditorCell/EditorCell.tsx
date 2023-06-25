import { drawingStore } from '~/store/store';
import { EditorMode } from '~/types';
import styles from './index.module.css';

interface EditorCellProps {
  color?: string;
  isGridVisible: boolean;
  changeCell?: (x: number, y: number) => void;
  copyColor?: (x: number, y: number) => void;
  x: number;
  y: number;
}

export const EditorCell = ({
  color,
  isGridVisible,
  changeCell,
  copyColor,
  x,
  y,
}: EditorCellProps) => {
  const size = drawingStore((state) => state.size);

  const sizeParam = 75 / size.width > 75 / size.height ? 75 / size.height : 75 / size.width;
  return (
    <div
      className={styles['container']}
      style={{
        border: `${isGridVisible ? '0.5px solid #555' : 'none'}`,
        background: color,
        width: `${sizeParam}vh`,
        height: `${sizeParam}vh`,
      }}
      onClick={() => changeCell && changeCell(x, y)}
      onContextMenu={(e) => {
        e.preventDefault();
        copyColor && copyColor(x, y);
      }}
    >
      <div />
    </div>
  );
};
