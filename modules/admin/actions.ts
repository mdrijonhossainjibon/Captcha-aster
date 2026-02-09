import * as types from './constants';

export const fetchAdminStatsRequest = () => ({
    type: types.FETCH_ADMIN_STATS_REQUEST,
});

export const fetchAdminStatsSuccess = (payload: any) => ({
    type: types.FETCH_ADMIN_STATS_SUCCESS,
    payload,
});

export const fetchAdminStatsFailure = (error: string) => ({
    type: types.FETCH_ADMIN_STATS_FAILURE,
    payload: error,
});
