export interface Paginated<T> {
    pagination: {
        page: number;
        prev: number;
        next: number;
        perPage: number;
        total: number;

        hasNext: boolean;
        hasPrev: boolean;
    };

    data: T[];
}

export const DEFAULT_PAGE_SIZE = 10;
