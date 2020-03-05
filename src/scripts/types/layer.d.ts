export interface Layer {
  id: string;
  type: 'image' | 'tiles';
  zoomLevels: number;
  timestamps: string[]; // ISO 8601 timestamps
  timeFormat: {
    year?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long';
    day?: 'numeric' | '2-digit';
    hour?: 'numeric' | '2-digit';
    minute?: 'numeric' | '2-digit';
    second?: 'numeric' | '2-digit';
  };
}
