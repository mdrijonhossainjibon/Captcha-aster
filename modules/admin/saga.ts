import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { API_CALL, APIResponse } from 'auth-fingerprint';

function* fetchAdminStatsSaga(): Generator {
    const { response, status }: APIResponse = yield call(API_CALL, { method: 'GET', url: '/admin/dashboard-stats' });

    if (response && status === 200) {
        yield put(actions.fetchAdminStatsSuccess(response));
        return;
    }
    yield put(actions.fetchAdminStatsFailure('Failed to fetch dashboard stats'));
}

export default function* adminSaga() {
    yield takeLatest(types.FETCH_ADMIN_STATS_REQUEST, fetchAdminStatsSaga);
}
