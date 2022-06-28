import { APIUrls } from 'constants/urls';

import { useApiTypeQuery } from 'hooks/useApiTypeQuery';

import styles from './ApiTypeSelect.module.css';

import type { ApiTypeKeys } from 'constants/urls';

interface ApiTypeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

const apiTypeKeys = Object.entries(APIUrls).map(([key]) => key) as ApiTypeKeys[];

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
