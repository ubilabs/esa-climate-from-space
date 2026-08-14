import styles from "./legend-footer.module.css";

export default function LegendFooter() {
  const description = "CAMS Analysis Total Aerosol Optical Depth at 55 nm";
  const values = [
    { value: 0.1, color: "#FFF9BD" },
    { value: 0.2, color: "#FFEC9D" },
    { value: 0.3, color: "#FEDD7E" },
    { value: 0.4, color: "#FEC45F" },
    { value: 0.5, color: "#FEA848" },
    { value: 0.6, color: "#FD8C3C" },
    { value: 0.7, color: "#FC5F2F" },
    { value: 0.8, color: "#F13624" },
    { value: 0.9, color: "#DC151E" },
    { value: 1, color: "#C00225" },
  ];

  return (
    <div className={styles.legendFooter}>
      <p>{description}</p>

      <div
        className={styles.scale}
        role="img"
        aria-label={`Color scale from ${values[0].value} to ${values[values.length - 1].value}`}
      >
        <span>0.0</span>
        <div className={styles.colorSwatches} aria-hidden="true">
          {values.map(({ value, color }) => (
            <span
              key={value}
              className={styles.swatch}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span>1.0</span>
      </div>
    </div>
  );
}
