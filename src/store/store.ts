import { create } from 'zustand';
import { AnimationType, EditorMode, SizeType, TextureType } from '../types';

interface Store {
  isMouseDown: boolean;
  setIsMouseDown: (data: boolean) => void;
  bgColor: string;
  size: SizeType;
  type: EditorMode;
  currentColor: string;
  currentTexture: TextureType;
  currentAnimation: AnimationType;
  currentSlide: number;
  setBgColor: (data: string) => void;
  setSize: (data: SizeType) => void;
  changeType: () => void;
  setCurrentSlide: (data: number) => void;
  setCurrentColor: (data: string) => void;
  setCurrentTexture: (data: TextureType) => void;
  setCurrentAnimation: (data: AnimationType) => void;
  increaseSlide: () => void;
  decreaseSlide: () => void;
}

export const drawingStore = create<Store>()((set) => ({
  isMouseDown: false,
  setIsMouseDown: (data: boolean) => set(() => ({isMouseDown: data})),
  bgColor: '#777',
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
  setBgColor: (data: string) => set(() => ({ bgColor: data })),
  setSize: (data: SizeType) => set(() => ({ size: data })),
  changeType: () =>
    set((state) => ({
      type: state.type === 'texture' ? 'file-select' : 'texture',
    })),
  setCurrentSlide: (data: number) => set(() => ({ currentSlide: data })),
  setCurrentColor: (data: string) => set(() => ({ currentColor: data })),
  setCurrentTexture: (data: TextureType) => set(() => ({ currentTexture: data })),
  setCurrentAnimation: (data: AnimationType) => set(() => ({ currentAnimation: data })),
  increaseSlide: () => set((state) => ({ currentSlide: state.currentSlide++ })),
  decreaseSlide: () => set((state) => ({ currentSlide: state.currentSlide-- })),
}));
