import { QuadrantType } from './types';

interface QuadrantDetail {
  title: string;
  color: string;
  textColor: string;
  addButtonColor: string;
  addButtonHoverColor: string;
  dragOverColor: string;
}

export const QUADRANT_DETAILS: Record<QuadrantType, QuadrantDetail> = {
  [QuadrantType.A]: {
    title: '重要かつ緊急',
    color: 'bg-red-500/20 border-red-500/50',
    textColor: 'text-red-400',
    addButtonColor: 'bg-red-500',
    addButtonHoverColor: 'hover:bg-red-600',
    dragOverColor: 'bg-red-500/30',
  },
  [QuadrantType.B]: {
    title: '重要だが緊急ではない',
    color: 'bg-green-500/20 border-green-500/50',
    textColor: 'text-green-400',
    addButtonColor: 'bg-green-500',
    addButtonHoverColor: 'hover:bg-green-600',
    dragOverColor: 'bg-green-500/30',
  },
  [QuadrantType.C]: {
    title: '重要でないが緊急',
    color: 'bg-yellow-500/20 border-yellow-500/50',
    textColor: 'text-yellow-400',
    addButtonColor: 'bg-yellow-500',
    addButtonHoverColor: 'hover:bg-yellow-600',
    dragOverColor: 'bg-yellow-500/30',
  },
  [QuadrantType.D]: {
    title: '重要でも緊急でもない',
    color: 'bg-gray-500/20 border-gray-500/50',
    textColor: 'text-gray-400',
    addButtonColor: 'bg-gray-500',
    addButtonHoverColor: 'hover:bg-gray-600',
    dragOverColor: 'bg-gray-500/30',
  },
};