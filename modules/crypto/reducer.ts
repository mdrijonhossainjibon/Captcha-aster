import * as types from './constants';

const initialState = {
    configs: [],
    prices: {} as Record<string, number>,
    loading: false,
    loadingPrice: false,
    recording: false,
    error: null,
};

const cryptoReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case types.FETCH_CRYPTO_CONFIG_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case types.FETCH_CRYPTO_CONFIG_SUCCESS:
            return {
                ...state,
                loading: false,
                configs: action.payload,
            };
        case types.FETCH_CRYPTO_CONFIG_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case types.FETCH_CRYPTO_PRICE_REQUEST:
            return {
                ...state,
                loadingPrice: true,
            };
        case types.FETCH_CRYPTO_PRICE_SUCCESS:
            return {
                ...state,
                loadingPrice: false,
                prices: {
                    ...state.prices,
                    [action.payload.cryptoId]: action.payload.price,
                },
            };
        case types.FETCH_CRYPTO_PRICE_FAILURE:
            return {
                ...state,
                loadingPrice: false,
            };
        case types.RECORD_DEPOSIT_REQUEST:
            return {
                ...state,
                recording: true,
            };
        case types.RECORD_DEPOSIT_SUCCESS:
            return {
                ...state,
                recording: false,
            };
        case types.RECORD_DEPOSIT_FAILURE:
            return {
                ...state,
                recording: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default cryptoReducer;
