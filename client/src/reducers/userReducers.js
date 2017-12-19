
// define reducers
export function userReducers(state={ users: [], userDetails : {},sabhas:[], events :[], loggedUser:{} }, action){
    let userData = [...state.users];
    let eventData = [...state.events];
    let sabhaData = [...state.sabhas];

    switch (action.type){
        case 'GET_USERS':
            userData = {...state, users:[...action.payload]};
            return userData;
        case 'VIEW_USER':
            userData = {...state, userDetails:{...action.payload}};
            return userData;
        case "UPDATE_USER":
            userData = {...state, userDetails:{...action.payload}};
            return userData;
        case "LOGIN":
            userData = {...state, loggedUser:{...action.payload}};
            return userData;
        case 'GET_EVENTS':
            eventData = {...state, events:[...action.payload]};
            return eventData;
        case 'GET_SABHAS':
            sabhaData = {...state, sabhas:[...action.payload]};
            return sabhaData;
        case 'GET_SABHA_USERS':
            userData = {...state, users:{...action.payload}};
            return userData;
        case 'SAVE_EVENT_ATTENDANCE':
            userData = {...state, users:[...action.payload]};
            return userData;
        default:
            return state;
    }
}

