import * as types from './constants';

export const fetchKolotiCacheRequest = (params: { search?: string; page: number; limit: number }) => ({
    type: types.FETCH_KOLOTI_CACHE_REQUEST,
    payload: params,
});

export const fetchKolotiCacheSuccess = (data: { records: any[]; pagination: any }) => ({
    type: types.FETCH_KOLOTI_CACHE_SUCCESS,
    payload: data,
});

export const fetchKolotiCacheFailure = (error: string) => ({
    type: types.FETCH_KOLOTI_CACHE_FAILURE,
    payload: error,
});

export const deleteKolotiCacheRequest = (recordId: string) => ({
    type: types.DELETE_KOLOTI_CACHE_REQUEST,
    payload: recordId,
});

export const deleteKolotiCacheSuccess = (recordId: string) => ({
    type: types.DELETE_KOLOTI_CACHE_SUCCESS,
    payload: recordId,
});

export const deleteKolotiCacheFailure = (error: string) => ({
    type: types.DELETE_KOLOTI_CACHE_FAILURE,
    payload: error,
});

export const updateKolotiCacheAnswerRequest = (data: { recordId: string; answer: number[] }) => ({
    type: types.UPDATE_KOLOTI_CACHE_ANSWER_REQUEST,
    payload: data,
});

export const updateKolotiCacheAnswerSuccess = (data: { recordId: string; answer: number[] }) => ({
    type: types.UPDATE_KOLOTI_CACHE_ANSWER_SUCCESS,
    payload: data,
});

export const updateKolotiCacheAnswerFailure = (error: string) => ({
    type: types.UPDATE_KOLOTI_CACHE_ANSWER_FAILURE,
    payload: error,
});
