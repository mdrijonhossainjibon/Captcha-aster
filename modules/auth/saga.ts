import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import { notification } from 'antd';
import { API_CALL, APIResponse } from 'auth-fingerprint';


function* registerSaga(action: any): Generator<any, any, any> {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/auth/register',
            body: action.payload,
        });

        if (status === 200 || status === 201) {
            yield put(actions.registerSuccess(response));
            notification.success({
                message: 'Account created!',
                description: 'Please verify your email to continue.',
            });
        } else {
            yield put(actions.registerFailure(response?.error || 'Something went wrong during registration.'));
            notification.error({
                message: 'Registration Failed',
                description: response?.error || 'Something went wrong during registration.',
            });
        }
    } catch (error: any) {
        yield put(actions.registerFailure(error.message || 'An error occurred during registration.'));
        notification.error({
            message: 'Connection Error',
            description: 'An error occurred during registration. Please try again.',
        });
    }
}

function* verifyEmailSaga(action: any): Generator<any, any, any> {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/auth/verify-email',
            body: action.payload,
        });

        if (status === 200) {
            yield put(actions.verifyEmailSuccess(response));
            notification.success({
                message: 'Email Verified',
                description: 'Your email has been verified successfully!',
            });
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        } else {
            yield put(actions.verifyEmailFailure(response?.error || 'The code you entered is incorrect.'));
            notification.error({
                message: 'Invalid OTP',
                description: response?.error || 'The code you entered is incorrect.',
            });
        }
    } catch (error: any) {
        yield put(actions.verifyEmailFailure(error.message || 'An error occurred during verification.'));
        notification.error({
            message: 'Verification Error',
            description: 'An error occurred during verification. Please try again.',
        });
    }
}

function* resendVerificationSaga(action: any): Generator<any, any, any> {
    try {
        const { response, status }: APIResponse = yield call(API_CALL, {
            method: 'POST',
            url: '/auth/resend-verification',
            body: action.payload,
        });

        if (status === 200) {
            yield put(actions.resendVerificationSuccess(response));
            notification.success({
                message: 'Code Resent',
                description: 'A new verification code has been sent to your email.',
            });
        } else {
            yield put(actions.resendVerificationFailure(response?.error || 'Failed to resend verification code.'));
            notification.error({
                message: 'Resend Failed',
                description: response?.error || 'Failed to resend verification code.',
            });
        }
    } catch (error: any) {
        yield put(actions.resendVerificationFailure(error.message || 'An error occurred. Please try again.'));
        notification.error({
            message: 'Error',
            description: 'An error occurred. Please try again.',
        });
    }
}

export default function* authSaga() {
    yield takeLatest(types.REGISTER_REQUEST, registerSaga);
    yield takeLatest(types.VERIFY_EMAIL_REQUEST, verifyEmailSaga);
    yield takeLatest(types.RESEND_VERIFICATION_REQUEST, resendVerificationSaga);
}
