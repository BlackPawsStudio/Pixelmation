import { useEffect } from 'react';
import { EditorArea } from '~/components/AnimationEditorArea';
import { drawingStore } from '~/store/store';
import { styles } from './styles.module.css';

export const AnimationPage = () => {
  const size = drawingStore((state) => state.size);

  const setSize = drawingStore((state) => state.setSize);
  const setCurrentColor = drawingStore((state) => state.setCurrentColor);
  const currentTexture = drawingStore((state) => state.currentTexture);
  const setCurrentTexture = drawingStore((state) => state.setCurrentTexture);

  useEffect(() => {
    if (currentTexture.cells.length === 0) {
      const texture = new Array(size.height).fill(0).map(() => {
        return new Array(size.width).fill('transparent');
      });
      setCurrentTexture({
        name: '',
        cells: texture,
      });
    }
  }, [setCurrentTexture, size, currentTexture]);

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
        <div>{currentTexture.name}</div>
        <button>
          Load texture
          <input
            type="file"
            id="file"
            style={{ display: 'none' }}
          />
        </button>
        <input
          className={styles['color']}
          name="color"
          type="color"
          onBlur={(e) => {
            setCurrentColor(e.target.value);
          }}
        />
        <label onClick={() => setCurrentColor('#00000000')}>Set transparent color</label>
        <button>Save and export</button>
      </div>
      <EditorArea />
    </div>
  );
};
