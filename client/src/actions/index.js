import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE
} from './types';

const ROOT_URL = 'http://localhost:3090';

const usersListURI = ROOT_URL+'/users';
const userDetailsBaseURI = ROOT_URL+'/user';

const eventsListURI = ROOT_URL+'/events';
const sabhaListURI = ROOT_URL+'/sabhas';

export const fetchUsers = () => (dispatch) => {
    axios.get(usersListURI)
        .then((res) => {
            const users = res.data;
            dispatch({ type: "GET_USERS", payload: users })
        })
};

export const fetchEvents = (callback) => (dispatch) => {
    axios.get(eventsListURI)
        .then((res) => {
            const events = res.data;
            callback(events);
            dispatch({ type: "GET_EVENTS", payload: events })
        })
};

export const fetchSabhas = (callback) => (dispatch) => {
    axios.get(sabhaListURI)
        .then((res) => {
            const sabhas = res.data;
            callback(sabhas);
            dispatch({ type: "GET_SABHAS", payload: sabhas })
        })
};

export const fetchSabhaUsers = (eventId, sabhaId, callback) => (dispatch) => {
    axios.get(eventsListURI+"/"+eventId+"/sabha/"+sabhaId+"/attendance")
        .then((res) => {
            const sabhaUsers = res.data;
            callback(sabhaUsers);
            dispatch({ type: "GET_SABHA_USERS", payload: sabhaUsers })
        })
};

export const saveEventAttendance = (eventId, included, excluded) => (dispatch) => {
        axios.post(eventsListURI+"/"+eventId+"/attendance", {
            included,
            excluded,
            event_id : eventId
        })
        .then((res) => {
            dispatch({ type: "SAVE_EVENT_ATTENDANCE", payload: res.data })
        })
};

export const viewUser = (familyId, userId, callback) => (dispatch) => {
    axios.get(userDetailsBaseURI+"/"+familyId+"/"+userId)
        .then((res) => {
            const userDetails = res.data.user_data;
            callback(userDetails);
            dispatch({ type: "VIEW_USER", payload: userDetails })
        })
};

export const updateUser = (data, callback) => (dispatch) => {
    axios.post(userDetailsBaseURI+"/"+data.u_id, {
        user: data
    })
        .then((res) => {
            callback(res.data);
            dispatch({ type: "UPDATE_USER", payload: res.data })
        })
};

export const login = (data, callback) => (dispatch) => {
    axios.post(userDetailsBaseURI+"/"+data.u_id, {
        user: data
    })
        .then((res) => {
            callback(res.data);
            dispatch({ type: "UPDATE_USER", payload: res.data })
        })
};


export function signinUser({ email, password },callback) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/signin`, { email, password })
      .then(response => {
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token', response.data.token);
        callback('/');
      })
      .catch(() => {
          callback('/login');
          dispatch(authError('Bad Login Info'));
      });
  }
}

export function signupUser({ email, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/signup`, { email, password })
      .then(response => {
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token', response.data.token);
        browserHistory.push('/feature');
      })
      .catch(response => dispatch(authError(response.data.error)));
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function signoutUser() {
  localStorage.removeItem('token');
  return { type: UNAUTH_USER };
}

export function fetchMessage() {
  return function(dispatch) {
    axios.get(ROOT_URL, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        });
      });
  }
}
