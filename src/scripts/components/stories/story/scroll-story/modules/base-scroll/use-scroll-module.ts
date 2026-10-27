import { createContext, use } from "react";
import { MotionValue } from "motion/react";

/**
 * Context value provided by ScrollModule to its children.
 * @template TConfig - Optional generic type for animation configuration
 */
export interface ScrollModuleContextValue<TConfig = unknown> {
  scrollYProgress: MotionValue<number>;
  scrollY: MotionValue<number>;
  config: TConfig;
}

export const ScrollModuleContext = createContext<
  ScrollModuleContextValue<unknown> | undefined
>(undefined);

/**
 * Hook to access scroll values and animation config from ScrollModule.
 * Must be used within a ScrollModule component.
 *
 * @template TConfig - Type of the animation configuration object
 * @returns Scroll motion values and optional config
 *
 * @example
 * ```tsx
 * // Simple usage (no config)
 * const { scrollYProgress } = useScrollModule();
 *
 * // With typed config
 * const { scrollYProgress, config } = useScrollModule<MyAnimationConfig>();
 * ```
 */
export function useScrollModule<
  TConfig = unknown,
>(): ScrollModuleContextValue<TConfig> {
  const context = use(ScrollModuleContext);
  if (!context) {
    throw new Error("useScrollModule must be used within ScrollModule");
  }
  return context as ScrollModuleContextValue<TConfig>;
}
