import { forwardRef, memo } from 'react';
import clsx from 'clsx';

import styles from './Select.module.css';

export interface SelectOptions<
    T extends string | number | string[] = string | number | string[]
> extends React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement> {
    label?: string;
    value: T;
}

interface SelectProps extends React.DetailedHTMLProps<
React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement
> {
    label: string;
    options: SelectOptions[];
}

export const Select = memo(forwardRef<
HTMLSelectElement,
SelectProps
>(({
    className,
    ...props
}, ref) => (
    <div className={styles.selectContainer}>
        {props.label}
        <select
            ref={ref}
            className={clsx(className, styles.select)}
            {...props}
        >
            {props.options.map((option) => (
                <option
                    key={`${option.label}${option.value}`}
                    value={option.value}
                >
                    {option.label ?? option.value}
                </option>
            ))}
        </select>
    </div>
)));
