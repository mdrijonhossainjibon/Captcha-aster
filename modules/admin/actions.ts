export const FETCH_ADMIN_STATS_REQUEST = 'FETCH_ADMIN_STATS_REQUEST';
export const FETCH_ADMIN_STATS_SUCCESS = 'FETCH_ADMIN_STATS_SUCCESS';
export const FETCH_ADMIN_STATS_FAILURE = 'FETCH_ADMIN_STATS_FAILURE';

export const fetchAdminStatsRequest = () => ({
    type: FETCH_ADMIN_STATS_REQUEST,
});

export const fetchAdminStatsSuccess = (payload: any) => ({
    type: FETCH_ADMIN_STATS_SUCCESS,
    payload,
});

export const fetchAdminStatsFailure = (error: string) => ({
    type: FETCH_ADMIN_STATS_FAILURE,
    payload: error,
});
