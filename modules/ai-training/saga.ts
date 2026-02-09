import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { API_CALL, APIResponse } from 'auth-fingerprint';

const getAiTrainingState = (state: any) => state.aiTraining;

function* fetchKolotiCacheSaga(action: any): Generator {
    try {
        const { search, page, limit } = action.payload;
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        const { response, status }: any = yield (call as any)(API_CALL, {
            method: 'GET',
            url: `/admin/ai-training/koloti-cache?${params.toString()}`
        });

        if (status === 200) {
            yield put(actions.fetchKolotiCacheSuccess(response));
        } else {
            yield put(actions.fetchKolotiCacheFailure(response?.error || 'Failed to fetch records'));
        }
    } catch (error: any) {
        yield put(actions.fetchKolotiCacheFailure(error.message || 'An error occurred'));
    }
}

function* deleteKolotiCacheSaga(action: any): Generator {
    try {
        const recordId = action.payload;
        const { response, status }: any = yield (call as any)(API_CALL, {
            method: 'DELETE',
            url: `/admin/ai-training/koloti-cache?recordId=${recordId}`
        });

        if (status === 200) {
            yield put(actions.deleteKolotiCacheSuccess(recordId));
            const state: any = yield select(getAiTrainingState);
            yield put(actions.fetchKolotiCacheRequest({
                search: '',
                page: state.pagination.page,
                limit: state.pagination.limit
            }));
        } else {
            yield put(actions.deleteKolotiCacheFailure(response?.error || 'Failed to delete record'));
        }
    } catch (error: any) {
        yield put(actions.deleteKolotiCacheFailure(error.message || 'An error occurred'));
    }
}

function* updateKolotiCacheAnswerSaga(action: any): Generator {
    try {
        const { recordId, answer } = action.payload;
        const { response, status }: any = yield (call as any)(API_CALL, {
            method: 'PATCH',
            url: '/admin/ai-training/koloti-cache',
            body: { recordId, answer }
        });

        if (status === 200) {
            yield put(actions.updateKolotiCacheAnswerSuccess({ recordId, answer }));
        } else {
            yield put(actions.updateKolotiCacheAnswerFailure(response?.error || 'Failed to update answer'));
        }
    } catch (error: any) {
        yield put(actions.updateKolotiCacheAnswerFailure(error.message || 'An error occurred'));
    }
}

export default function* aiTrainingSaga() {
    yield all([
        takeLatest(types.FETCH_KOLOTI_CACHE_REQUEST, fetchKolotiCacheSaga),
        takeLatest(types.DELETE_KOLOTI_CACHE_REQUEST, deleteKolotiCacheSaga),
        takeLatest(types.UPDATE_KOLOTI_CACHE_ANSWER_REQUEST, updateKolotiCacheAnswerSaga),
    ]);
}
