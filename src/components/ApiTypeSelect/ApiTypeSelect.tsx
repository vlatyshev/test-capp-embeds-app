import { API_URLS } from 'constants/urls';
import { useApiTypeQuery } from 'hooks/useApiTypeQuery';

import styles from './ApiTypeSelect.module.css';

import type { ApiTypeKeys } from 'constants/urls';

interface ApiTypeSelectProps extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> { }

const apiTypeKeys = Object.entries(API_URLS).map(([key]) => key) as ApiTypeKeys[];

export const ApiTypeSelect = (selectProps: ApiTypeSelectProps) => {
    const apiTypeQuery = useApiTypeQuery();

    return (
        <div className={styles.selectContainer}>
            API:
            <select
                defaultValue={apiTypeQuery}
                className={styles.select}
                {...selectProps}
            >
                {apiTypeKeys.map((apiTypeVal) => (
                    <option key={apiTypeVal} value={apiTypeVal}>{apiTypeVal}</option>
                ))}
            </select>
        </div>
    );
};
