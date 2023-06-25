import { create } from 'zustand';
import { AnimationType, EditorMode, SizeType, TextureType } from '../types';

interface Store {
  size: SizeType;
  type: EditorMode;
  currentColor: string;
  currentTexture: TextureType;
  currentAnimation: AnimationType;
  currentSlide: number;
  setSize: (data: SizeType) => void;
  changeType: () => void;
  setCurrentColor: (data: string) => void;
  setCurrentTexture: (data: TextureType) => void;
  setCurrentAnimation: (data: AnimationType) => void;
  increaseSlide: () => void;
  decreaseSlide: () => void;
}

export const drawingStore = create<Store>()((set) => ({
  size: { width: 25, height: 25 },
  type: 'texture',
  currentColor: '#000000',
  currentTexture: {
    name: '',
    cells: [],
  },
  currentAnimation: {
    name: '',
    slides: [],
  },
  currentSlide: 0,
  setSize: (data: SizeType) => set(() => ({ size: data })),
  changeType: () =>
    set((state) => ({
      type: state.type === 'texture' ? 'file-select' : 'texture',
    })),
  setCurrentColor: (data: string) => set(() => ({ currentColor: data })),
  setCurrentTexture: (data: TextureType) => set(() => ({ currentTexture: data })),
  setCurrentAnimation: (data: AnimationType) => set(() => ({ currentAnimation: data })),
  increaseSlide: () => set((state) => ({ currentSlide: state.currentSlide++ })),
  decreaseSlide: () => set((state) => ({ currentSlide: state.currentSlide-- })),
}));
