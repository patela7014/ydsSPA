import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import authReducer from './auth_reducer';
import {userReducers} from './userReducers';

const rootReducer = combineReducers({
    form,
    auth: authReducer,
    data : userReducers
});

export default rootReducer;
