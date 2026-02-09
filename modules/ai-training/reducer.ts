import * as types from './constants';

const initialState = {
    records: [],
    pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
    },
    loading: false,
    error: null,
    isDeleting: false,
    isSaving: false,
};

const aiTrainingReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.FETCH_KOLOTI_CACHE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case types.FETCH_KOLOTI_CACHE_SUCCESS:
            return {
                ...state,
                loading: false,
                records: action.payload.records,
                pagination: action.payload.pagination,
            };
        case types.FETCH_KOLOTI_CACHE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case types.DELETE_KOLOTI_CACHE_REQUEST:
            return {
                ...state,
                isDeleting: true,
            };
        case types.DELETE_KOLOTI_CACHE_SUCCESS:
            return {
                ...state,
                isDeleting: false,
                records: state.records.filter((record: any) => record.id !== action.payload),
                pagination: {
                    ...state.pagination,
                    total: state.pagination.total - 1
                }
            };
        case types.DELETE_KOLOTI_CACHE_FAILURE:
            return {
                ...state,
                isDeleting: false,
            };
        case types.UPDATE_KOLOTI_CACHE_ANSWER_REQUEST:
            return {
                ...state,
                isSaving: true,
            };
        case types.UPDATE_KOLOTI_CACHE_ANSWER_SUCCESS:
            return {
                ...state,
                isSaving: false,
                records: state.records.map((record: any) =>
                    record.id === action.payload.recordId
                        ? { ...record, answer: action.payload.answer }
                        : record
                )
            };
        case types.UPDATE_KOLOTI_CACHE_ANSWER_FAILURE:
            return {
                ...state,
                isSaving: false,
            };
        default:
            return state;
    }
};

export default aiTrainingReducer;
