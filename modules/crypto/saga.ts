import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { API_CALL, APIResponse } from 'auth-fingerprint';
import { notification } from 'antd';

function* fetchCryptoConfigSaga(): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'GET',
            url: '/crypto/config'
        });

        if (status === 200 && response.success) {
            yield put(actions.fetchCryptoConfigSuccess(response.data));
        } else {
            yield put(actions.fetchCryptoConfigFailure(response?.error || 'Failed to fetch config'));
        }
    } catch (error: any) {
        yield put(actions.fetchCryptoConfigFailure(error.message));
    }
}

function* fetchCryptoPriceSaga(action: any): Generator {
    const cryptoId = action.payload;
    if (['usdt', 'usdc'].includes(cryptoId.toLowerCase())) {
        yield put(actions.fetchCryptoPriceSuccess(cryptoId, 1.0));
        return;
    }

    try {
        const geckoMap: Record<string, string> = {
            'eth': 'ethereum',
            'bnb': 'binancecoin',
            'matic': 'matic-network',
            'btc': 'bitcoin',
            'sol': 'solana',
            'arb': 'arbitrum'
        };
        const geckoId = geckoMap[cryptoId.toLowerCase()] || cryptoId.toLowerCase();

        const response: Response = yield call(fetch, `https://api.coingecko.com/api/v3/simple/price?ids=${geckoId}&vs_currencies=usd`);
        const data: any = yield call([response, response.json]);

        if (data[geckoId]) {
            yield put(actions.fetchCryptoPriceSuccess(cryptoId, data[geckoId].usd));
        }
    } catch (err: any) {
        yield put(actions.fetchCryptoPriceFailure(err.message));
    }
}

function* recordDepositSaga(action: any): Generator {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/crypto/deposits',
            body: action.payload
        });

        if (status === 200) {
            yield put(actions.recordDepositSuccess(response));
        } else {
            yield put(actions.recordDepositFailure(response?.error || 'Failed to record deposit'));
        }
    } catch (error: any) {
        yield put(actions.recordDepositFailure(error.message));
    }
}

export default function* cryptoSaga() {
    yield takeLatest(types.FETCH_CRYPTO_CONFIG_REQUEST, fetchCryptoConfigSaga);
    yield takeLatest(types.FETCH_CRYPTO_PRICE_REQUEST, fetchCryptoPriceSaga);
    yield takeLatest(types.RECORD_DEPOSIT_REQUEST, recordDepositSaga);
}
