/**
 * Animation timing configuration for the KettleAmount scroll module.
 * All inputRange values are normalized scroll progress (0-1).
 */
export interface KettleAmountAnimationConfig {
  /** Initial reveal animations (0-20% of scroll) */
  initial: {
    scale: { input: number[]; output: number[] };
    yPosition: { input: number[]; output: string[] };
    bulbOpacity: { input: number[]; output: number[] };
  };
  /** Bulb container exit animation (10-20% of scroll) */
  bulbExit: {
    input: number[];
    output: string[];
  };
  /** Square meter label scaling (20-30% of scroll) */
  squareMeterScale: {
    input: number[];
    output: string[];
  };
  /** Satellite entrance and exit animations (30-67% of scroll) */
  satellite: {
    xPosition: { input: number[]; output: string[] };
    opacity: { input: number[]; output: string[] };
  };
  /** Kettle row reveal configuration (50-60% of scroll) */
  kettleRows: {
    rangeStart: number;
    rangeEnd: number;
    fadeIn: { input: number[]; output: number[] };
  };
  /** Year slider animations (30-64% of scroll) */
  yearSlider: {
    fadeIn: { input: number[]; output: string[] };
    slide: { input: number[]; output: string[] };
  };
  /** Text overlay configurations with timing and content */
  overlays: Array<{
    inputRange: [number, number, number, number];
    text: string;
  }>;
}
