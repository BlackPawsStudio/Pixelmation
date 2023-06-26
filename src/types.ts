export interface SizeType {
  width: number;
  height: number;
}

export type EditorMode = 'texture' | 'file-select';

export interface TextureType {
  name: string;
  cells: string[][];
}

export interface CoordinatesType {
  x: number;
  y: number;
}

export interface AnimationType {
  name: string;
  slides: (CoordinatesType | null)[][][];
}
