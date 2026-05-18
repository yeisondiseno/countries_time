"use client";

import { useTranslations } from "next-intl";

import { FiMoon, FiSun } from "react-icons/fi";

import { useTheme } from "@/components/providers/ThemeProvider/ThemeProvider";

import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("Theme");
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={isDark ? t("switchLight") : t("switchDark")}
      aria-pressed={isDark}
      title={isDark ? t("switchLight") : t("switchDark")}
    >
      <span className={styles.track} aria-hidden>
        <span className={styles.thumb}>
          {isDark ? <FiMoon size={13} /> : <FiSun size={13} />}
        </span>
        <FiSun className={`${styles.icon} ${styles.iconLeft}`} size={12} />
        <FiMoon className={`${styles.icon} ${styles.iconRight}`} size={12} />
      </span>
    </button>
  );
}
