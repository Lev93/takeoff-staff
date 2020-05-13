/* eslint-disable class-methods-use-this */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'qs';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions';

const mapStateToProps = (state) => {
  const props = {
    user: state.user,
  };
  return props;
};

const actionCreators = {
  onAddUser: actions.addUser,
};


class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: {
        email: '',
        password: '',
      },
      reg: {
        email: '',
        password: '',
        name: '',
      },
      error: false,
      errortext: '',
    };
  }

  onChangeEmailLogin = (event) => {
    event.preventDefault();
    const { login } = this.state;
    login.email = event.target.value;
    this.setState({ login });
  }

  onChangePasswordLogin = (event) => {
    event.preventDefault();
    const { login } = this.state;
    login.password = event.target.value;
    this.setState({ login });
  }

  onChangeEmailReg = (event) => {
    event.preventDefault();
    const { reg } = this.state;
    reg.email = event.target.value;
    this.setState({ reg });
  }

  onChangePasswordReg = (event) => {
    event.preventDefault();
    const { reg } = this.state;
    reg.password = event.target.value;
    this.setState({ reg });
  }

  onChangeNameReg = (event) => {
    event.preventDefault();
    const { reg } = this.state;
    reg.name = event.target.value;
    this.setState({ reg });
  }

  registerHandler = (event) => {
    event.preventDefault();
    const {
      onAddUser,
    } = this.props;
    const data = {
      name: this.state.reg.name,
      email: this.state.reg.email,
      password: this.state.reg.password,
    };
    try {
      axios({
        method: 'post',
        url: '/auth/registration',
        data: qs.stringify(data),
      }).then((response) => {
        if (response.data.user && !response.data.error) {
          onAddUser(response.data.user);
          this.props.history.push('/');
        } else {
          this.setState({
            error: true,
            errortext: response.data.error,
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  loginHandler = (event) => {
    event.preventDefault();
    const {
      onAddUser,
    } = this.props;
    const data = {
      email: this.state.login.email,
      password: this.state.login.password,
    };
    try {
      axios({
        method: 'post',
        url: '/auth/login',
        data: qs.stringify(data),
      }).then((response) => {
        if (response.data.user && !response.data.error) {
          onAddUser(response.data.user);
          this.props.history.push('/');
        } else {
          this.setState({
            error: true,
            errortext: response.data.error,
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div className="page-login">
        <div className="page-login__wrapper">
          <div className="page-login__login">
            <h2>Вход</h2>
            <form className="page-login__form" method="post" onSubmit={this.loginHandler}>
              <input className="page-login__input" type="email" name="email" placeholder="Введите email"
              required value={this.state.login.email} onChange={this.onChangeEmailLogin}/>
              <input className="page-login__input" type="password" name="password" placeholder="Введите пароль"
              required value={this.state.login.password} onChange={this.onChangePasswordLogin}/>
              <button className="login__submit" type="submit">Войти</button>
            </form>
          </div>
          <div className="page-login__login">
            <h2>Регистрация</h2>
            <form className="page-login__form" method="post" onSubmit={this.registerHandler}>
              <input className="page-login__input" type="text" name="name" placeholder="Введите имя"
              required value={this.state.reg.name} onChange={this.onChangeNameReg}/>
              <input className="page-login__input" type="email" name="email" placeholder="Введите email"
              required value={this.state.reg.email} onChange={this.onChangeEmailReg}/>
              <input className="page-login__input" type="password" name="password" placeholder="Введите пароль"
              required value={this.state.reg.password} onChange={this.onChangePasswordReg}/>
              <button className="login__submit" type="submit">Регистрация</button>
            </form>
          </div>
        </div>
        <div className="login__error__block">
          {this.state.error ? <span className="login__error">{this.state.errortext}</span> : null }
        </div>
      </div>
    );
  }
}

Auth.propTypes = {
  onAddUser: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default connect(mapStateToProps, actionCreators)(withRouter((Auth)));
