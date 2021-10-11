import React from 'react';

import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Flip, ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';

import CoreLayout from '../layouts/CoreLayout';
import PageNotFound from '../routes/404/PageNotFound';
import AdminEventsList from '../routes/Admin/AdminEventsList';
import AdminUsersList from '../routes/Admin/AdminUsersList';
import Editor from '../routes/Editor';
import EditSignup from '../routes/EditSignup';
import Events from '../routes/Events';
import Login from '../routes/Login/Login';
import SingleEvent from '../routes/SingleEvent';
import configureStore, { history } from '../store/configureStore';
import requireAuth from './requireAuth';

import 'react-toastify/scss/main.scss';

const { store, persistor } = configureStore();

const AppContainer = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <div style={{ height: '100%' }}>
        <ConnectedRouter history={history}>
          <CoreLayout>
            <Switch>
              <Route
                exact
                path={`${PREFIX_URL}/`}
                component={Events}
              />
              <Route
                exact
                path={`${PREFIX_URL}/event/:slug`}
                component={SingleEvent}
              />
              <Route
                exact
                path={`${PREFIX_URL}/signup/:id/:editToken`}
                component={EditSignup}
              />
              <Route
                exact
                path={`${PREFIX_URL}/login`}
                component={Login}
              />
              <Route
                exact
                path={`${PREFIX_URL}/admin`}
                component={requireAuth(AdminEventsList)}
              />
              <Route
                exact
                path={`${PREFIX_URL}/admin/users`}
                component={requireAuth(AdminUsersList)}
              />
              <Route
                exact
                path={`${PREFIX_URL}/admin/edit/:id`}
                component={requireAuth(Editor)}
              />
              <Route
                path="*"
                component={PageNotFound}
              />
            </Switch>
          </CoreLayout>
        </ConnectedRouter>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          transition={Flip}
        />
      </div>
    </PersistGate>
  </Provider>
);

export default AppContainer;