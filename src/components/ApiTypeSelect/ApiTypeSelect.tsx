import { APIUrls } from 'constants/urls';
import { memo } from 'react';

import { useQuery } from 'hooks/useQuery';
import { Select, SelectOptions } from 'components/controls/Select';

import type { ApiTypeKeys } from 'constants/urls';

interface ApiTypeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

const apiTypeKeys: SelectOptions<ApiTypeKeys>[] = Object.entries(APIUrls).map(([key]) => ({
    label: key,
    value: key as ApiTypeKeys,
}));

export const ApiTypeSelect = memo((selectProps: ApiTypeSelectProps) => {
    const [query] = useQuery();
    const { apiType } = query;

    return (
        <Select
            label="API:"
            options={apiTypeKeys}
            defaultValue={apiType}
            {...selectProps}
        />
    );
});
