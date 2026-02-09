import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';

import { API_CALL, APIResponse } from 'auth-fingerprint';
import { fetchDashboardDataFailure, fetchDashboardDataSuccess } from './actions';

function* fetchDashboardDataSaga(): Generator {
    try {
        const [statsRes, keysRes]: any = yield all([
            call(API_CALL, { method: 'GET', url: '/dashboard/stats' }),
            call(API_CALL, { method: 'GET', url: '/dashboard/api-keys' })
        ]);

        console.log(statsRes, keysRes);
        if (statsRes.status === 200 && keysRes.status === 200) {
            yield put(fetchDashboardDataSuccess({
                userData: statsRes.response.user,
                dailyUsage: statsRes.response.dailyUsage,
                activePackage: statsRes.response.package,
                apiKeys: keysRes.response.apiKeys
            }));
        } else {
            yield put(fetchDashboardDataFailure('Failed to fetch dashboard data'));
        }
    } catch (error: any) {
        yield put(fetchDashboardDataFailure(error.message || 'An error occurred'));
    }
}

export default function* dashboardSaga() {
    yield takeLatest(types.FETCH_DASHBOARD_DATA_REQUEST, fetchDashboardDataSaga);
}
