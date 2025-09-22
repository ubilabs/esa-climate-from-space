import { FunctionComponent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FormattedMessage } from "react-intl";

interface Props {
  show: boolean;
  messageId: string;
}

export const InstructionOverlay: FunctionComponent<Props> = ({ show, messageId }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-describedby="gesture-instructions"
        >
          <FormattedMessage id={messageId} />
        </motion.span>
      )}
    </AnimatePresence>
  );
};
