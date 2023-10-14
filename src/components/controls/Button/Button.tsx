import { forwardRef, memo } from 'react';
import clsx from 'clsx';

import styles from './Button.module.css';

export const Button = memo(forwardRef<
HTMLButtonElement,
React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
>(({
    className,
    ...props
}, ref) => (
    <button
        ref={ref}
        type="button"
        className={clsx(className, styles.button)}
        {...props}
    />
)));
