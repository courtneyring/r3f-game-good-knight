import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export default create(subscribeWithSelector((set) => {
  return {
    phase: 'ready',
    blocksCount: 10,
    blocksSeed: 0,
    startTime: 0,
    endTime: 0,
    start: () => set((state) => state.phase == 'ready' ? { phase: 'playing', startTime: Date.now() } : {}),
    restart: () => set((state) => state.phase == 'playing' || state.phase == 'ended' ? { phase: 'ready', blocksSeed: Math.random() }: {}),
    end: () => set((state) => state.phase == 'playing' ? { phase: 'ended', endTime: Date.now() }: {}),
  }
}));