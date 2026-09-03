import { Legend } from "../../../../../../../types/story";
import styles from "./legend-footer.module.css";

export default function LegendFooter({
  legend,
}: {
  legend: Omit<Legend, "type" | "unit">;
}) {
  const { description, values } = legend;
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
