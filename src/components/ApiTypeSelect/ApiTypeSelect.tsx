import { APIUrls } from 'constants/urls';
import { memo } from 'react';

import { useQuery } from 'hooks/useQuery';

import styles from './ApiTypeSelect.module.css';

import type { ApiTypeKeys } from 'constants/urls';

interface ApiTypeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

const apiTypeKeys = Object.entries(APIUrls).map(([key]) => key) as ApiTypeKeys[];

export const ApiTypeSelect = memo((selectProps: ApiTypeSelectProps) => {
    const [query] = useQuery();
    const { apiType } = query;

    return (
        <div className={styles.selectContainer}>
            API:
            <select
                defaultValue={apiType}
                className={styles.select}
                {...selectProps}
            >
                {apiTypeKeys.map((apiTypeVal) => (
                    <option key={apiTypeVal} value={apiTypeVal}>{apiTypeVal}</option>
                ))}
            </select>
        </div>
    );
});
