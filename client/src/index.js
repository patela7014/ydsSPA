import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, Route } from 'react-router-dom';
// import { browserHistory } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'
const customHistory = createBrowserHistory();
export default customHistory;
import reduxThunk from 'redux-thunk';
// import App from './components/app';

import Signout from './components/auth/signout';
import reducers from './reducers';
import { AUTH_USER } from './actions/types';

import User_Container from './components/user_container'
import Menu from './components/menu'
import UserDetails from './components/userDetails'
import Login from './components/login';
import Attendance from './components/attendance';
import AddEvent from './components/addEvent';
import EventsList from './components/eventsList';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

const token = localStorage.getItem('token');
// If we have a token, consider the user to be signed in
if (token) {
  // we need to update application state
  store.dispatch({ type: AUTH_USER });
}
ReactDOM.render(
  <Provider store={store}>
    <Router history={customHistory}>
      <div className="page-container">
          <Menu/>
          <Route exact path="/" component={User_Container}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/logout" component={Signout}/>
          <Route exact path="/events/:event_id/sabha/:sabha_id/attendance" component={Attendance}/>
          <Route exact path="/events/add" component={AddEvent}/>
          <Route exact path="/events" component={EventsList}/>
          <Route exact path="/user/:family_id/:user_id" component={UserDetails}/>
      </div>
    </Router>
  </Provider>
  , document.querySelector('#root'));
