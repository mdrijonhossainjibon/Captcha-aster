import { combineReducers } from 'redux';

import adminReducer from './admin/reducer';
import dashboardReducer from './dashboard/reducer';
import aiTrainingReducer from './ai-training/reducer';
import authReducer from './auth/reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    admin: adminReducer,
    dashboard: dashboardReducer,
    aiTraining: aiTrainingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

