import { all } from 'redux-saga/effects';

import adminSaga from './admin/saga';
import dashboardSaga from './dashboard/saga';

export default function* rootSaga(): Generator {
    yield all([
        adminSaga(),
        dashboardSaga(),
    ]);
}

