import * as types from './constants';

const initialState = {
    userData: null,
    dailyUsage: null,
    activePackage: null,
    apiKeys: [],
    loading: false,
    error: null,
};

const dashboardReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.FETCH_DASHBOARD_DATA_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case types.FETCH_DASHBOARD_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                userData: action.payload.userData,
                dailyUsage: action.payload.dailyUsage,
                activePackage: action.payload.activePackage,
                apiKeys: action.payload.apiKeys,
                error: null,
            };
        case types.FETCH_DASHBOARD_DATA_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default dashboardReducer;
