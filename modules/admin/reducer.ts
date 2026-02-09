import * as types from './actions';

const initialState = {
    stats: null,
    loading: false,
    error: null,
};

const adminReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.FETCH_ADMIN_STATS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case types.FETCH_ADMIN_STATS_SUCCESS:
            return {
                ...state,
                loading: false,
                stats: action.payload,
                error: null,
            };
        case types.FETCH_ADMIN_STATS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default adminReducer;
