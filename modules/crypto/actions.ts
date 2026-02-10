import * as types from './constants';

export const fetchCryptoConfigRequest = () => ({
    type: types.FETCH_CRYPTO_CONFIG_REQUEST,
});

export const fetchCryptoConfigSuccess = (payload: any) => ({
    type: types.FETCH_CRYPTO_CONFIG_SUCCESS,
    payload,
});

export const fetchCryptoConfigFailure = (error: string) => ({
    type: types.FETCH_CRYPTO_CONFIG_FAILURE,
    payload: error,
});

export const fetchCryptoPriceRequest = (cryptoId: string) => ({
    type: types.FETCH_CRYPTO_PRICE_REQUEST,
    payload: cryptoId,
});

export const fetchCryptoPriceSuccess = (cryptoId: string, price: number) => ({
    type: types.FETCH_CRYPTO_PRICE_SUCCESS,
    payload: { cryptoId, price },
});

export const fetchCryptoPriceFailure = (error: string) => ({
    type: types.FETCH_CRYPTO_PRICE_FAILURE,
    payload: error,
});

export const recordDepositRequest = (payload: any) => ({
    type: types.RECORD_DEPOSIT_REQUEST,
    payload,
});

export const recordDepositSuccess = (payload: any) => ({
    type: types.RECORD_DEPOSIT_SUCCESS,
    payload,
});

export const recordDepositFailure = (error: string) => ({
    type: types.RECORD_DEPOSIT_FAILURE,
    payload: error,
});
