/* eslint-disable class-methods-use-this */
/* eslint no-underscore-dangle: 0 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import qs from 'qs';
import { NavLink, withRouter } from 'react-router-dom';
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


class Userpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.user.email,
      password: '',
      name: this.props.user.name,
      status: false,
      text: '',
    };
  }

  onChangeEmailReg = (event) => {
    event.preventDefault();
    this.setState({
      email: event.target.value,
    });
  }

  onChangePasswordReg = (event) => {
    event.preventDefault();
    this.setState({
      password: event.target.value,
    });
  }

  onChangeNameReg = (event) => {
    event.preventDefault();
    this.setState({
      name: event.target.value,
    });
  }

  editHandler = (event) => {
    event.preventDefault();
    const {
      onAddUser,
    } = this.props;
    const data = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      id: this.props.user.id,
    };
    try {
      axios({
        method: 'post',
        url: '/auth/edit',
        data: qs.stringify(data),
      }).then((response) => {
        onAddUser(response.data.user);
        this.props.history.push('/');
        this.setState({
          status: true,
          text: response.data.text,
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div className="page-login">
        <NavLink className="link" to="/contacts">В контакты</NavLink>
        <div className="page-login__wrapper">
          <div className="page-login__login">
            <h2>Редактирование профиля</h2>
            <form className="page-login__form" method="post" onSubmit={this.editHandler}>
              <input className="page-login__input" type="text" name="name" placeholder="Введите имя"
              required value={this.state.name} onChange={this.onChangeNameReg}/>
              <input className="page-login__input" type="email" name="email" placeholder="Введите email"
              required value={this.state.email} onChange={this.onChangeEmailReg}/>
              <input className="page-login__input" type="password" name="password" placeholder="Введите новый пароль"
              required value={this.state.password} onChange={this.onChangePasswordReg}/>
              <button className="login__submit" type="submit">Обновить</button>
            </form>
          </div>
        </div>
        {this.state.status ? <span className="login__error">{this.state.text}</span> : null }
      </div>
    );
  }
}

Userpage.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    id: PropTypes.string,
  }),
  onAddUser: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default connect(mapStateToProps, actionCreators)(withRouter((Userpage)));
