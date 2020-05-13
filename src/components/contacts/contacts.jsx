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


class Contacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      users: [],
      contacts: [],
      results: [],
      search: '',
    };
  }

  componentDidMount() {
    const { user } = this.props;
    const data = {
      userId: user.id,
      contactsUsers: user.contacts.users,
    };
    axios({
      method: 'post',
      url: '/contacts/getcontacts',
      data: qs.stringify(data),
    }).then((response) => {
      this.setState({
        isLoaded: true,
        users: [...response.data.users],
        contacts: [...response.data.contacts],
      });
    });
  }

  handleClickAddContact = (user) => () => {
    const { users, contacts } = this.state;
    const newusers = users.filter((el) => el._id !== user._id);
    const newcontacts = contacts;
    newcontacts.push(user);
    this.setState({ users: newusers, contacts: newcontacts });
    const data = {
      user,
      mainUserId: this.props.user.id,
    };
    axios({
      method: 'post',
      url: '/contacts/add',
      data: qs.stringify(data),
    });
  };


  handleClickRemoveContact = (user) => () => {
    const { users, contacts } = this.state;
    const newusers = users;
    newusers.push(user);
    const newcontacts = contacts.filter((el) => el._id !== user._id);
    this.setState({ users: newusers, contacts: newcontacts });
    const data = {
      user,
      mainUserId: this.props.user.id,
    };
    axios({
      method: 'post',
      url: '/contacts/remove',
      data: qs.stringify(data),
    });
  };

  onChangeSearch= (event) => {
    event.preventDefault();
    this.setState({
      search: event.target.value,
    });
    axios({
      method: 'post',
      url: '/contacts/search',
      data: qs.stringify({ text: event.target.value }),
    }).then((response) => {
      console.log(response.data);
      this.setState({
        results: [...response.data],
      });
    });
  }

  renderUsers() {
    return <div className="users">
      <h2>Все пользователи</h2>
      <div className="users-wrapper">
      {this.state.users.map((user) => <div className="user" key={user._id}>
          <p className="user-title">{user.name}</p>
          <p className="user-title">{user.email}</p>
          <button type="button" onClick={this.handleClickAddContact(user)}>Добавить в контакты</button>
        </div>)
      }
      </div>
    </div>;
  }

  renderContacts() {
    return <div className="users">
      <h2>Ваши контакты</h2>
      <div className="users-wrapper">
      {this.state.contacts.map((user) => <div className="user" key={user._id}>
          <p className="user-title">{user.name}</p>
          <p className="user-title">{user.email}</p>
          <button type="button" onClick={this.handleClickRemoveContact(user)}>Удалить</button>
        </div>)
      }
      </div>
    </div>;
  }

  renderSearch() {
    return <div className="users">
      <h2>Все пользователи</h2>
      <div className="users-wrapper">
      {this.state.results.map((user) => <div className="user" key={user._id}>
          <p className="user-title">{user.name}</p>
          <p className="user-title">{user.email}</p>
          <button type="button" onClick={this.handleClickAddContact(user)}>Добавить в контакты</button>
        </div>)
      }
      </div>
    </div>;
  }

  render() {
    return (
      <div className="page-login">
        <NavLink className="link" to="/">В редактирование профиля</NavLink>
        <div className="page-contacts__wrapper">
          <div className="search">
            <p>Поиск</p>
            <input type="text" className="search-field" placeholder="введите email пользователя"
            value={this.state.search} onChange={this.onChangeSearch}/>
            {this.state.results.length > 0 ? this.renderSearch()
              : <span>Нет подходящих пользователей</span>}
          </div>
          <div className="contacts-wrapper">
            <div className="contacts">
              {this.state.users.length > 0 ? this.renderUsers()
                : <span>Других пользователей нет</span>}
            </div>
            <div className="contacts">
              {this.state.contacts.length > 0 ? this.renderContacts()
                : <div className="users"><span>У вас нет контактов</span></div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Contacts.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    id: PropTypes.string,
    contacts: PropTypes.arrayOf(PropTypes.string),
  }),
  onAddUser: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default connect(mapStateToProps, actionCreators)(withRouter((Contacts)));
