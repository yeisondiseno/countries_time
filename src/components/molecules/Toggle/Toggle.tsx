import type { ReactNode } from "react";

import { FiChevronDown } from "react-icons/fi";

import styles from "./Toggle.module.css";

export type ToggleProps = Readonly<{
  open: boolean;
  onToggle: () => void;
  panelId: string;
  title: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
}>;

export function Toggle({
  open,
  onToggle,
  panelId,
  title,
  meta,
  children,
}: ToggleProps) {
  return (
    <section className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <h2 className={styles.title}>
          {title}
          {meta ? <span className={styles.meta}>{meta}</span> : null}
        </h2>
        <FiChevronDown className={styles.chevron} aria-hidden />
      </button>
      {open ? (
        <div id={panelId} className={styles.panel}>
          {children}
        </div>
      ) : null}
    </section>
  );
}
