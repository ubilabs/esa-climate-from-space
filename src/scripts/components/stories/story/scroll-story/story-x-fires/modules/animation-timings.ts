/**
 * Shared text beats for the x-fires story.
 *
 * A beat consists of enter -> brief hold -> exit. Keeping these ranges here
 * prevents individual modules from slowly developing different reading speeds.
 */
export const ENTERING_TEXT_OUTPUT = ["100%", "0%", "0%", "-20%", "-100%"]; 
export const VISIBLE_TEXT_OUTPUT = ["0%", "0%", "-20%", "-100%"]; 

export const THREE_TEXT_TIMING = {
  first: [0, 0.06, 0.16, 0.21, 0.25],
  firstVisible: [0, 0.16, 0.21, 0.25],
  second: [0.25, 0.31, 0.41, 0.46, 0.5],
  third: [0.5, 0.56, 0.68, 0.74, 0.8],
};

export const TWO_TEXT_TIMING = {
  first: [0, 0.08, 0.18, 0.25, 0.31],
  second: [0.31, 0.39, 0.53, 0.61, 0.69],
};
