import { combineReducers } from 'redux';

import adminReducer from './admin/reducer';
import dashboardReducer from './dashboard/reducer';
import aiTrainingReducer from './ai-training/reducer';
import authReducer from './auth/reducer';
import settingsReducer from './settings/reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    admin: adminReducer,
    dashboard: dashboardReducer,
    aiTraining: aiTrainingReducer,
    settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;

