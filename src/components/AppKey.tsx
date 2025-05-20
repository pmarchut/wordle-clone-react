import styles from "./AppKey.module.scss"
import React, { useEffect, useRef } from 'react';

type AppKeyProps = {
  ariaLabel: string;
  dataKey?: string;
  ariaDisabled: boolean;
  dataState?: string;
  spacerBefore?: boolean;
  spacerAfter?: boolean;
  oneAndAHalf?: boolean;
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const AppKey: React.FC<AppKeyProps> = ({
  ariaLabel,
  dataKey,
  ariaDisabled,
  dataState,
  spacerBefore,
  spacerAfter,
  oneAndAHalf,
  children,
  ...rest
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
    };

    const btn = btnRef.current;
    btn?.addEventListener('mousedown', handleMouseDown);

    return () => {
      btn?.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <>
      {spacerBefore && <div data-testid="spacer" className={`${styles.half}`} />}
      <button
        ref={btnRef}
        type="button"
        tabIndex={0}
        className={`${styles.key} ${oneAndAHalf ? styles.oneAndAHalf : ''}`}
        aria-label={ariaLabel}
        data-key={dataKey}
        aria-disabled={ariaDisabled ? "true" : "false"}
        data-state={dataState}
        {...rest}
      >
        {children}
      </button>
      {spacerAfter && <div data-testid="spacer" className={`${styles.half}`} />}
    </>
  );
};

export default AppKey;
