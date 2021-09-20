import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {getLayerTimeIndex} from '../libs/get-image-layer-data';
import {getTimeRanges} from '../libs/get-time-ranges';
import {State} from '../reducers';
import {timeSelector} from '../selectors/globe/time';
import {languageSelector} from '../selectors/language';
import {layerDetailsSelector} from '../selectors/layers/layer-details';
import {selectedLayerIdsSelector} from '../selectors/layers/selected-ids';

export const useLayerTimes = () => {
  const language = useSelector(languageSelector);
  const selectedLayerIds = useSelector(selectedLayerIdsSelector);
  const time = useSelector(timeSelector);
  const {mainId, compareId} = selectedLayerIds;
  const mainLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, mainId)
  );
  const compareLayerDetails = useSelector((state: State) =>
    layerDetailsSelector(state, compareId)
  );

  // date format
  const mainDateFormat = mainLayerDetails?.timeFormat;
  const compareDateFormat = compareLayerDetails?.timeFormat;

  // ranges
  const {main: rangeMain, compare: rangeCompare, combined} = useMemo(
    () => getTimeRanges(mainLayerDetails, compareLayerDetails),
    [mainLayerDetails, compareLayerDetails]
  );

  const mainFormat = useMemo(
    () => new Intl.DateTimeFormat(language, mainDateFormat || {}),
    [language, mainDateFormat]
  ).format;

  const compareFormat = useMemo(
    () => new Intl.DateTimeFormat(language, compareDateFormat || {}),
    [language, compareDateFormat]
  ).format;

  const timeIndexMain = useMemo(
    () => getLayerTimeIndex(time, rangeMain?.timestamps || []),
    [time, rangeMain]
  );
  const timeIndexCompare = useMemo(
    () => getLayerTimeIndex(time, rangeCompare?.timestamps || []),
    [time, rangeCompare]
  );

  const timeSelectedMain =
    rangeMain && new Date(rangeMain.timestamps[timeIndexMain]);
  const timeSelectedCompare =
    rangeCompare && new Date(rangeCompare.timestamps[timeIndexCompare]);

  const mainTimeFormat = timeSelectedMain
    ? mainFormat(timeSelectedMain)
    : false;

  const compareTimeFormat = timeSelectedCompare
    ? compareFormat(timeSelectedCompare)
    : false;

  return {
    mainTimeFormat,
    compareTimeFormat,
    rangeMain,
    rangeCompare,
    combined,
    timeIndexMain,
    timeIndexCompare
  };
};
