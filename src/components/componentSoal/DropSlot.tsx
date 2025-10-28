'use client'

import React from 'react';
import { Plus, ChevronDown } from 'lucide-react';

interface DropSlotProps {
  slotNumber: number;
  circuitId: string | null;
  isActive?: boolean;
  isDragOver?: boolean;
  onDrop?: (e: React.DragEvent, slotIndex: number) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onRemove?: (slotIndex: number) => void;
  onKeyDown?: (e: React.KeyboardEvent, slotIndex: number) => void;
  children?: React.ReactNode;
  className?: string;
}

const DropSlot: React.FC<DropSlotProps> = ({
  slotNumber,
  circuitId,
  isActive = false,
  isDragOver = false,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemove,
  onKeyDown,
  children,
  className = ''
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop?.(e, slotNumber - 1); // Convert 1-based slotNumber to 0-based index
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver?.(e);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    onDragLeave?.(e);
  };

  const handleRemove = () => {
    if (circuitId) {
      onRemove?.(slotNumber - 1); // Convert 1-based slotNumber to 0-based index
    }
  };

  return (
    <div
      className={`
        relative w-full rounded-2xl border-2 border-dashed
        transition-all duration-300 flex items-center justify-center
        ${isDragOver 
          ? 'border-cyan-400 bg-cyan-400/10 scale-105' 
          : circuitId 
            ? 'border-white/30 bg-white/5' 
            : 'border-white/20 bg-white/5 hover:border-white/40'
        }
        ${isActive ? 'ring-2 ring-cyan-400 ring-opacity-50' : ''}
        ${className || 'min-h-[120px]'}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onKeyDown={(e) => onKeyDown?.(e, slotNumber - 1)} // Convert to 0-based index
      tabIndex={0}
      role="button"
      aria-label={`Slot ${slotNumber}${circuitId ? `, berisi rangkaian ${circuitId}` : ', kosong'}`}
    >
      {/* Slot Number */}
      <div className="absolute top-2 left-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-sm">{slotNumber}</span>
      </div>

      {/* Remove Button */}
      {circuitId && (
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
          aria-label={`Hapus rangkaian ${circuitId} dari slot ${slotNumber}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}

      {/* Content */}
      {children ? (
        <div className="w-full h-full flex items-center justify-center p-3">
          {children}
        </div>
      ) : (
        <div className="text-center">
          {isDragOver ? (
            <div className="text-cyan-400">
              <ChevronDown className="w-8 h-8 mx-auto animate-bounce" />
              <span className="text-sm font-medium">Lepas di sini</span>
            </div>
          ) : (
            <div className="text-white/40">
              <Plus className="w-8 h-8 mx-auto" />
              <span className="text-sm">Slot {slotNumber}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropSlot;