import { useEffect, useState } from 'react';
import styles from './index.module.css';
import { useNavigate } from 'react-router-dom';
import { drawingStore } from '~/store/store';
import { Switcher } from '../../Switcher';

export const FieldSelector = () => {
  const size = drawingStore((state) => state.size);
  const setSize = drawingStore((state) => state.setSize);
  const type = drawingStore((state) => state.type);
  const changeType = drawingStore((state) => state.changeType);
  const setCurrentTexture = drawingStore((state) => state.setCurrentTexture);

  const [x, setX] = useState(size.width);
  const [y, setY] = useState(size.height);

  const navigate = useNavigate();

  useEffect(() => {
    setSize({
      width: x,
      height: y,
    });
  }, [x, y, setSize]);

  const saveSize = () => {
    setCurrentTexture({
      name: '',
      cells: new Array(size.height).fill(0).map((_, idx) => {
        return new Array(size.width).fill('transparent');
      }),
    });
    navigate(`/${type}`);
  };

  const changeParam = (value: number, setter: (number: number) => void) => {
    if (value > 75) {
      value = 75;
    }
    if (value <= 0) {
      value = 1;
    }
    setter(value);
  };

  return (
    <div className={styles['container']}>
      <Switcher name={'What to create?'} onChange={changeType} />
      <div>
        <div>Enter width</div>
        <input
          type="number"
          defaultValue={25}
          placeholder={`${x}`}
          onChange={(e) => changeParam(+e.target.value, setX)}
        />
      </div>
      <div>
        <div>Enter height</div>
        <input
          type="number"
          defaultValue={25}
          placeholder={`${y}`}
          onChange={(e) => changeParam(+e.target.value, setY)}
        />
      </div>
      <button onClick={saveSize}>Generate</button>
    </div>
  );
};
