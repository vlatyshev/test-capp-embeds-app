import { memo, useCallback } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import { Button } from 'components/controls/Button';

import styles from './Pagination.module.css';

type PaginationProps = {
    loading?: boolean;
    currentCount: number;
    limit: number;
    page: number;
    pages: number;
    onPageChange: (offset: number) => void;
};

export const Pagination = memo(({
    loading,
    currentCount,
    limit,
    page,
    pages,
    onPageChange,
}: PaginationProps) => {
    const handlePrevPage = useCallback(() => {
        onPageChange((page - 2) * limit);
    }, [onPageChange, limit, page]);

    const handleNextPage = useCallback(() => {
        onPageChange(page * limit);
    }, [onPageChange, limit, page]);

    return (
        <div className={styles.pagination}>
            <span>
                Count: {currentCount}
            </span>
            <span>
                All: {pages * limit}
            </span>
            <span>
                Pages: {page} / {pages}
            </span>
            <Button
                disabled={loading || page <= 1}
                onClick={handlePrevPage}
                className={styles.button}
            >
                <FaAngleLeft />
            </Button>
            <Button
                disabled={loading || page >= pages}
                onClick={handleNextPage}
            >
                <FaAngleRight />
            </Button>
        </div>
    );
});
