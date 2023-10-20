import { TextureEditorArea } from '~/components/TextureEditorArea';
import styles from '~/components/TextureEditorArea/styles.module.css';
import { useRef, useEffect } from 'react';
import { drawingStore } from '~/store/store';
import html2canvas from 'html2canvas';

export const TexturePage = () => {
  const size = drawingStore((state) => state.size);
  const setSize = drawingStore((state) => state.setSize);
  const currentColor = drawingStore((state) => state.currentColor);
  const setCurrentColor = drawingStore((state) => state.setCurrentColor);
  const currentTexture = drawingStore((state) => state.currentTexture);
  const setCurrentTexture = drawingStore((state) => state.setCurrentTexture);
  const bgColor = drawingStore((state) => state.bgColor);
  const setBgColor = drawingStore((state) => state.setBgColor);

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
    const filename = prompt('Enter texture name', currentTexture.name);
    if (filename !== null) {
      setCurrentTexture({
        name: filename,
        cells: currentTexture.cells,
      });
      setTimeout(() => {
        currentTexture.name = filename;
        const texture = currentTexture.cells.map((row) =>
          row.map((el) => (el === 'transparent' ? null : el))
        );
        const dataStr =
          'data:text/json;charset=utf-8,' +
          encodeURIComponent(
            JSON.stringify({
              name: currentTexture.name,
              cells: texture,
            })
          );
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

  const exportAsImage = () => {
    html2canvas(document.querySelector('#contents') as HTMLElement, {
      backgroundColor: '#00000000',
    }).then((canvas) => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 3; i < image.data.length; i += 4) {
          image.data[i] = 50;
        }
        const img = canvas.toDataURL('image/png');
        const filename = currentTexture.name || 'export image';
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
          value={currentColor}
          onChange={() => {}}
          onBlur={(e) => {
            setCurrentColor(e.target.value);
          }}
        />
        <label onClick={() => setCurrentColor('#00000000')}>Set transparent color</label>
        Background color
        <input
          type="color"
          onBlur={(e: React.ChangeEvent<HTMLInputElement>) => setBgColor(e.target.value)}
          defaultValue={bgColor}
        />
        <button onClick={exportFile}>Save and export</button>
        <button onClick={exportAsImage}>
          Export texture <br />
          as png <br />
          (disable grid
          <br /> before export)
        </button>
      </div>
      <TextureEditorArea />
    </div>
  );
};
