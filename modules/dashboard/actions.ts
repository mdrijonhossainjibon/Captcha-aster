import * as types from './constants';

export const fetchDashboardDataRequest = () => ({
    type: types.FETCH_DASHBOARD_DATA_REQUEST,
});

export const fetchDashboardDataSuccess = (payload: any) => ({
    type: types.FETCH_DASHBOARD_DATA_SUCCESS,
    payload,
});

export const fetchDashboardDataFailure = (error: string) => ({
    type: types.FETCH_DASHBOARD_DATA_FAILURE,
    payload: error,
});
