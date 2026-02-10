import * as types from './constants';

export const registerRequest = (payload: any) => ({
    type: types.REGISTER_REQUEST,
    payload,
});

export const registerSuccess = (payload: any) => ({
    type: types.REGISTER_SUCCESS,
    payload,
});

export const registerFailure = (error: string) => ({
    type: types.REGISTER_FAILURE,
    payload: error,
});

export const verifyEmailRequest = (payload: any) => ({
    type: types.VERIFY_EMAIL_REQUEST,
    payload,
});

export const verifyEmailSuccess = (payload: any) => ({
    type: types.VERIFY_EMAIL_SUCCESS,
    payload,
});

export const verifyEmailFailure = (error: string) => ({
    type: types.VERIFY_EMAIL_FAILURE,
    payload: error,
});

export const resendVerificationRequest = (payload: any) => ({
    type: types.RESEND_VERIFICATION_REQUEST,
    payload,
});

export const resendVerificationSuccess = (payload: any) => ({
    type: types.RESEND_VERIFICATION_SUCCESS,
    payload,
});

export const resendVerificationFailure = (error: string) => ({
    type: types.RESEND_VERIFICATION_FAILURE,
    payload: error,
});

export const resetAuthState = () => ({
    type: types.RESET_AUTH_STATE,
});
