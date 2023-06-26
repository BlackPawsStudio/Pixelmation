import { TextureEditorArea } from '~/components/TextureEditorArea';
import styles from '~/components/TextureEditorArea/styles.module.css';
import { useRef, useEffect } from 'react';
import { drawingStore } from '~/store/store';

export const TexturePage = () => {
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

  const inputFile = useRef<HTMLInputElement>(null);

  const importFile = () => {
    if (inputFile.current) {
      inputFile.current.click();
    }
  };

  const handleFileData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length === 1) {
      if (e.target.files[0]) {
        const file = e.target.files[0];
        if (file.type === 'application/json') {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target && e.target.result) {
              const fileData = JSON.parse(e.target.result as string);
              setSize({
                width: fileData.cells[0].length,
                height: fileData.cells.length,
              });
              setCurrentTexture(fileData);
            }
          };
          reader.readAsText(file);
        } else {
          alert('File selected incorrectly');
        }
      }
    } else {
      alert('File selected incorrectly');
    }
  };

  const exportFile = () => {
    const filename = prompt('Enter texture name');
    if (filename !== null) {
      setCurrentTexture({
        name: filename,
        cells: currentTexture.cells,
      });
      setTimeout(() => {
        currentTexture.name = filename;
        const dataStr =
          'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentTexture));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', filename + '_texture.json');
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }, 5);
    } else {
      alert('Incorrect name!');
    }
  };

  return (
    <div className={styles['container']}>
      <div className={styles['config']}>
        <div>{currentTexture.name}</div>
        <button onClick={importFile}>
          Load texture
          <input
            type="file"
            id="file"
            ref={inputFile}
            style={{ display: 'none' }}
            onChange={handleFileData}
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
        <button onClick={exportFile}>Save and export</button>
      </div>
      <TextureEditorArea />
    </div>
  );
};
