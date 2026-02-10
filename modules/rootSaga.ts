import { all } from 'redux-saga/effects';

import adminSaga from './admin/saga';
import dashboardSaga from './dashboard/saga';
import aiTrainingSaga from './ai-training/saga';
import authSaga from './auth/saga';
import settingsSaga from './settings/saga';

export default function* rootSaga(): Generator {
    yield all([
        adminSaga(),
        dashboardSaga(),
        aiTrainingSaga(),
        authSaga(),
        settingsSaga(),
    ]);
}

