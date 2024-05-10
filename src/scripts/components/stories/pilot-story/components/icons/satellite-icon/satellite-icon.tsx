import React, {FunctionComponent, SVGAttributes} from 'react';

import cx from 'classnames';

import styles from './satellite-icon.module.styl';

interface Props extends Omit<SVGAttributes<SVGSVGElement>, 'viewBox'> {
  isSelected?: boolean;
}

const SatelliteIcon: FunctionComponent<Props> = ({
  isSelected = true,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="172"
    height="148"
    viewBox="0 0 172 148"
    className={cx(
      isSelected && styles.selected,
      styles.satelliteIcon,
      props.className
    )}
    fill="none"
    {...props}>
    <path
      d="M49.285 48.2096L29.1451 70.9401L59.2539 67.6M60.6684 67.4431L59.2539 67.6M58.9171 59.5748L68.5492 92.7964M58.9171 59.5748C58.0415 56.9521 55.9399 50.8323 54.5389 47.3353C53.9484 45.8615 53.1298 44.543 52.2929 43.4452M58.9171 59.5748L56.2902 60.4491C55.7064 58.992 54.0897 55.2036 52.2929 51.7066C50.0469 47.3353 48.4093 47.3353 46.658 46.0864C45.257 45.0873 46.658 43.9093 47.5337 43.4452H52.2929M68.5492 92.7964L98.3212 78.8084M68.5492 92.7964V97.1677L70.41 96.2934M98.3212 78.8084L86.9378 43.8383M98.3212 78.8084L125.466 74.4371M86.9378 43.8383L83.4733 33.3473V21.1078M86.9378 43.8383L89.5648 36.8443L87.8135 31.2247M86.9378 43.8383L83.4733 45.6172M125.466 74.4371L123.186 67.4431M125.466 74.4371V78.8084M110.58 18.485L171 2.7485L160.492 21.982L113.207 34.2216M110.58 18.485V11.491C108.479 11.491 107.661 13.2395 107.516 14.1138V20.2335L107.935 26.8748M110.58 18.485L113.207 29.8503V34.2216M113.207 34.2216V35.5329M142.979 18.485L123.186 67.4431M123.186 67.4431L113.207 36.8443V35.5329M42.2798 21.982L55.4145 40.9241M73.8031 67.4431L67.6736 82.3054M73.8031 67.4431L93.0674 71.8144M73.8031 67.4431L66.5285 56.9521M81.6839 63.0719L75.5544 40.3413L71.1762 42.5269M76.4301 42.9641L80.8083 40.3413L81.8743 43.8383M81.8743 43.8383L64.7098 51.7066M81.8743 43.8383L82.5596 46.0864M64.7098 51.7066L63.2953 46.4611L66.7979 44.7126M64.7098 51.7066L67.7746 63.0719M83.4733 49.0838L66.5285 56.9521M83.4733 49.0838L85.2056 54.7665M83.4733 49.0838L82.5596 46.0864M66.5285 56.9521L59.2539 46.4611M85.2056 54.7665L86.9378 60.4491L77.3057 65.2575M85.2056 54.7665L67.7746 63.0719M67.7746 63.0719L69.4249 69.1916L72.9275 67.4431M66.7979 44.7126L72.9275 67.4431M66.7979 44.7126L71.1762 42.5269M72.9275 67.4431L77.3057 65.2575M71.1762 42.5269L77.3057 65.2575M104.653 63.9461L103.575 60.4491H107.516M104.653 63.9461H112.803M104.653 63.9461L105.865 67.8802M112.803 63.9461L111.456 60.4491H107.516M112.803 63.9461L114.319 67.8802M105.865 67.8802L107.078 71.8144H111.456M105.865 67.8802H114.319M114.319 67.8802L115.834 71.8144H111.456M107.516 60.4491L111.456 71.8144M98.7927 48.2096L97.4456 44.7126H105.326L106.674 48.2096M98.7927 48.2096H106.674M98.7927 48.2096L100.308 52.1437M106.674 48.2096L108.189 52.1437M100.308 52.1437L101.824 56.0778H109.705L108.189 52.1437M100.308 52.1437H108.189M57.4352 43.8383C58.6269 42.058 60.6565 39.5469 63.2953 37.0448M57.4352 43.8383L79.3238 33.1949M57.4352 43.8383L59.2539 46.4611M57.4352 43.8383L55.4145 40.9241M79.9326 28.1018C73.437 28.9665 67.5677 32.9939 63.2953 37.0448M63.2953 37.0448C64.4629 33.1896 69.6 25.3042 80.8083 24.6048V32.4731L79.3238 33.1949M83.4352 22.8563H85.2056L86.4579 26.8748M82.5596 46.0864L83.4733 45.6172M79.3238 33.1949L83.4733 45.6172M49.285 38.5168L45.7824 40.3413L2 27.2275L46.658 1L86.0622 19.3593L55.4145 35.3239M49.285 38.5168V40.3413C49.9604 40.8471 51.1439 41.9382 52.2929 43.4452M49.285 38.5168L55.4145 35.3239M61.544 58.7006L59.2539 46.4611M55.4145 40.9241V35.3239M59.2539 67.6L53.6632 61.3234M86.0622 23.7305H92.1917L95.6943 27.2275M95.6943 27.2275L86.4579 26.8748M95.6943 27.2275L105.326 28.976M86.4579 26.8748L87.8135 31.2247M105.326 28.976L107.935 26.8748M105.326 28.976L104.451 31.2247H87.8135M107.935 26.8748L109.705 29.8503M101.824 32.4731C101.824 33.0559 102.174 34.2216 103.575 34.2216C104.976 34.2216 108.245 31.3074 109.705 29.8503M109.705 29.8503V35.5329H113.207M125.466 78.8084L98.3212 83.1796L94.5997 84.9281M125.466 78.8084V81.4311L124.591 81.588M70.41 96.2934L92.1917 120.772H95.6943M70.41 96.2934L73.8031 94.6992M73.8031 94.6992L94.5997 84.9281M73.8031 94.6992L80.8083 102.634M100.948 91.9222H98.3212V100.665M100.948 91.9222L96.1869 86.6766M100.948 91.9222L131.596 86.4301M135.098 122.521L110.58 129.515M135.098 122.521V105.91M135.098 122.521L162.244 131.263M96.5699 115.527H98.3212V114.653M96.5699 115.527L125.466 143.503M96.5699 115.527H95.6943M125.466 143.503V147M125.466 143.503L162.244 131.263M125.466 147L100.948 135.635V121.647H99.1969L96.5699 133.012V133.886M125.466 147L162.244 134.76V131.263M106.202 138.257L99.1969 140.88L96.5699 139.132V133.886M95.6943 115.527L96.5699 133.886M95.6943 115.527H93.0674M94.5997 84.9281L94.8187 105.036M94.5997 84.9281L96.1869 86.6766M77.3057 93.6707L82.5596 96.2934L83.4352 98.9162M83.4352 98.9162L82.5596 101.539L80.8083 102.634M83.4352 98.9162H86.0622L89.5648 100.665L93.0674 108.533M80.8083 102.634L92.1917 115.527H93.0674M93.0674 108.533V115.527M93.0674 108.533L98.3212 100.665M98.3212 100.665V102.634M96.1869 86.6766L124.591 81.588M124.591 81.588L131.596 86.4301M131.596 86.4301L135.098 85.8024V95.4192M98.3212 102.634L128.093 96.7933M98.3212 102.634V107.659M135.098 95.4192L128.093 96.7933M135.098 95.4192V105.91M128.093 96.7933V100.665M98.3212 107.659L128.093 101.539V100.665M98.3212 107.659V114.653M98.3212 114.653L135.098 105.91M135.098 105.91L128.093 100.665M135.098 105.91L162.244 131.263"
      stroke="#98DBCE"
    />
  </svg>
);

export default SatelliteIcon;
