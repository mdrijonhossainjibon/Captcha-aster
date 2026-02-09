import { combineReducers } from 'redux';

import adminReducer from './admin/reducer';
import dashboardReducer from './dashboard/reducer';

const rootReducer = combineReducers({
    admin: adminReducer,
    dashboard: dashboardReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

