'use client';

import { LayoutGrid, List } from 'lucide-react';

interface GridListToggleProps {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}

export function GridListToggle({ view, onChange }: GridListToggleProps) {
  return (
    <div className="flex border overflow-hidden" style={{ borderColor: 'var(--color-amoria-border)' }}>
      <button
        onClick={() => onChange('grid')}
        className="p-2 transition-colors"
        style={{
          backgroundColor: view === 'grid' ? 'var(--color-amoria-primary)' : 'transparent',
          color: view === 'grid' ? 'white' : 'var(--color-amoria-text-muted)',
        }}
        aria-label="Grid view"
      >
        <LayoutGrid size={16} />
      </button>
      <button
        onClick={() => onChange('list')}
        className="p-2 transition-colors"
        style={{
          backgroundColor: view === 'list' ? 'var(--color-amoria-primary)' : 'transparent',
          color: view === 'list' ? 'white' : 'var(--color-amoria-text-muted)',
        }}
        aria-label="List view"
      >
        <List size={16} />
      </button>
    </div>
  );
}
