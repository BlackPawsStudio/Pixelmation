import { useEffect, useState } from 'react';
import { drawingStore } from '~/store/store';
import styles from './index.module.css';

export const Switcher = ({
  onChange,
  name,
  isOn,
}: {
  onChange: (v: boolean) => void;
  name: string;
  isOn?: boolean;
}) => {
  const type = drawingStore((state) => state.type);

  useEffect(() => {
    if (typeof isOn === 'boolean') {
      setIsRight(isOn);
    }
  }, [isOn]);
  const [isRight, setIsRight] = useState(false);
  return (
    <div className={styles['container']}>
      <span
        onClick={() => {
          onChange(!isRight);
          setIsRight(!isRight);
        }}
        className={`${styles['slider']} ${isRight ? styles['slider-right'] : ''}`}
      >
        {type === 'file-select' ? "animation" : type}
      </span>
      <input type="checkbox" checked={isRight} onChange={() => {}} name={name} />
    </div>
  );
};
