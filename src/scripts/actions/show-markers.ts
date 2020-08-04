export const SHOW_MARKERS = 'SHOW_MARKERS';

export interface ShowMarkersAction {
  type: typeof SHOW_MARKERS;
  showMarkers: boolean;
}

const showMarkersAction = (showMarkers: boolean): ShowMarkersAction => ({
  type: SHOW_MARKERS,
  showMarkers
});

export default showMarkersAction;
