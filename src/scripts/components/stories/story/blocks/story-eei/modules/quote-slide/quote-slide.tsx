import { useModuleContent } from "../../../../../../../providers/story/module-content/use-module-content";
import styles from "./quote-slide.module.css";

export default function QuoteSlide() {
  const { module: {text} } = useModuleContent();

  return <q className={styles.quote}>{text}</q>;
}
