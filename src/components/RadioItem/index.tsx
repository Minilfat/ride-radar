import React from 'react';

import * as styles from './styles.module.scss';

type RadioItemProps = {
  value: string;
  name: string;
  checked?: boolean;
  label?: string;
  children?: React.ReactNode;
  onChange?: (value: string) => void;
};

export const RadioItem = React.forwardRef<HTMLInputElement, RadioItemProps>(
  ({ label, children, value, name, checked, onChange }, ref) => {
    return (
      <label className={styles.radio}>
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange && onChange(value)}
          ref={ref}
        />
        <span className={styles['radio-circle']}>
          {checked && <span className={styles['radio-dot']} />}
        </span>
        <span className={styles['radio-label']}>{label || children}</span>
      </label>
    );
  },
);
RadioItem.displayName = 'RadioItem';
