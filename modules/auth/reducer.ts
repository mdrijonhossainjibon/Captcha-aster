import * as types from './constants';

interface AuthState {
    loading: boolean;
    error: string | null;
    registrationSuccess: boolean;
    verificationSuccess: boolean;
    requiresVerification: boolean;
    user: any | null;
    token: string | null;
}

const initialState: AuthState = {
    loading: false,
    error: null,
    registrationSuccess: false,
    verificationSuccess: false,
    requiresVerification: false,
    user: null,
    token: null,
};

const authReducer = (state = initialState, action: any): AuthState => {
    switch (action.type) {
        case types.REGISTER_REQUEST:
        case types.VERIFY_EMAIL_REQUEST:
        case types.RESEND_VERIFICATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case types.REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                registrationSuccess: true,
                requiresVerification: action.payload.requiresVerification ?? true,
            };

        case types.VERIFY_EMAIL_SUCCESS:
            return {
                ...state,
                loading: false,
                verificationSuccess: true,
                user: action.payload.user,
                token: action.payload.token,
            };

        case types.RESEND_VERIFICATION_SUCCESS:
            return {
                ...state,
                loading: false,
            };

        case types.REGISTER_FAILURE:
        case types.VERIFY_EMAIL_FAILURE:
        case types.RESEND_VERIFICATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case types.RESET_AUTH_STATE:
            return initialState;

        default:
            return state;
    }
};

export default authReducer;
