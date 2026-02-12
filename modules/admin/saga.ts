import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { API_CALL, APIResponse } from 'auth-fingerprint';
import { message } from 'antd';

function* fetchAdminStatsSaga(): Generator {
    const { response, status }: APIResponse = yield call(API_CALL, { method: 'GET', url: '/admin/dashboard-stats' });

    if (response && status === 200) {
        yield put(actions.fetchAdminStatsSuccess(response));
        return;
    }
    yield put(actions.fetchAdminStatsFailure('Failed to fetch dashboard stats'));
}

function* fetchAdminUsersSaga(action: any): Generator {
    try {
        const { searchTerm, statusFilter, page, limit } = action.payload;
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (statusFilter) params.append('status', statusFilter);
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: `/admin/users?${params.toString()}`
        });

        if (response && response.success) {
            yield put(actions.fetchAdminUsersSuccess({ users: response.users, pagination: response.pagination }));
        } else {
            yield put(actions.fetchAdminUsersFailure(response?.error || 'Failed to fetch users'));
            message.error(response?.error || 'Failed to fetch users');
        }
    } catch (error) {
        yield put(actions.fetchAdminUsersFailure('Failed to fetch users'));
        message.error('Failed to fetch users');
    }
}

function* updateAdminUserSaga(action: any): Generator {
    try {
        const { userId, name, balance, status: userStatus } = action.payload;

        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'PATCH',
            url: '/admin/users',
            body: {
                userId,
                name,
                balance,
                status: userStatus
            }
        });

        if (response && response.success) {
            yield put(actions.updateAdminUserSuccess({ id: userId, name, balance, status: userStatus }));
            message.success('User updated successfully');
            // Optimistic update done in reducer, and success message shown.
            // Alternatively, we could refetch users if needed, but reducer update is faster.
            // If the API returns the updated user, we should use that instead.
            // Assuming response usually sends back updated data, but here user just set success.
            // But the reducer uses action.payload, which is what we sent.
            // The component also called fetchUsers() after update.
            // Let's refetch users to be safe and consistent with the previous logic.
            // Or better, just update the state locally as I did in the reducer.
        } else {
            yield put(actions.updateAdminUserFailure(response?.error || 'Failed to update user'));
            message.error(response?.error || 'Failed to update user');
        }
    } catch (error) {
        yield put(actions.updateAdminUserFailure('Failed to update user'));
        message.error('Failed to update user');
    }
}

function* deleteAdminUserSaga(action: any): Generator {
    try {
        const userId = action.payload;

        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'DELETE',
            url: `/admin/users?userId=${userId}`
        });

        if (response && response.success) {
            yield put(actions.deleteAdminUserSuccess(userId));
            message.success('User deleted successfully');
        } else {
            yield put(actions.deleteAdminUserFailure(response?.error || 'Failed to delete user'));
            message.error(response?.error || 'Failed to delete user');
        }
    } catch (error) {
        yield put(actions.deleteAdminUserFailure('Failed to delete user'));
        message.error('Failed to delete user');
    }
}

export default function* adminSaga() {
    yield takeLatest(types.FETCH_ADMIN_STATS_REQUEST, fetchAdminStatsSaga);
    yield takeLatest(types.FETCH_ADMIN_USERS_REQUEST, fetchAdminUsersSaga);
    yield takeLatest(types.UPDATE_ADMIN_USER_REQUEST, updateAdminUserSaga);
    yield takeLatest(types.DELETE_ADMIN_USER_REQUEST, deleteAdminUserSaga);
}
