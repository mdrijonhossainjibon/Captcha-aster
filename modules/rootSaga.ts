import { all } from 'redux-saga/effects';



import adminSaga from './admin/saga';

export default function* rootSaga(): Generator {
    yield all([
        adminSaga(),
    ]);
}
