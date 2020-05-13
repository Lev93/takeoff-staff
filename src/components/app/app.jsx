/* eslint-disable arrow-body-style */
/* eslint-disable class-methods-use-this */
import React from 'react';
import { connect } from 'react-redux';
import {
  Route,
  Switch,
  Redirect,
  withRouter,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import * as actions from '../../actions';
import Auth from '../auth/auth.jsx';
import UserPage from '../userpage/userpage.jsx';
import Contacts from '../contacts/contacts.jsx';

const mapStateToProps = (state) => {
  const props = {
    user: state.user,
  };
  return props;
};

const actionCreators = {
  onAddUser: actions.addUser,
  removeUser: actions.removeUser,
};

class App extends React.Component {
  render() {
    const { user } = this.props;
    return <Switch>
    <Route path="/" exact render={() => {
      return user.id ? <UserPage /> : <Auth />;
    }}/>
    <Route path="/contacts" render={() => {
      return user.id ? <Contacts /> : <Redirect to={'/'}/>;
    }}/>
    <Redirect to={'/'}/>
  </Switch>;
  }
}

App.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  onAddUser: PropTypes.func.isRequired,
  removeUser: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, actionCreators)(App));
