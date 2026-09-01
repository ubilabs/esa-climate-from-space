/**
 * Shared text beats for the x-fires story.
 *
 * A beat consists of enter -> hold -> exit. Keeping these ranges here prevents
 * individual modules from slowly developing different reading speeds.
 */
export const ENTERING_TEXT_OUTPUT = ["100%", "0%", "0%", "-100%"];
export const VISIBLE_TEXT_OUTPUT = ["0%", "0%", "-100%"];

export const THREE_TEXT_TIMING = {
  first: [0, 0.07, 0.21, 0.28],
  firstVisible: [0, 0.21, 0.28],
  second: [0.28, 0.35, 0.49, 0.56],
  third: [0.56, 0.63, 0.77, 0.84],
};

export const TWO_TEXT_TIMING = {
  first: [0, 0.1, 0.3, 0.4],
  second: [0.4, 0.5, 0.7, 0.8],
};
