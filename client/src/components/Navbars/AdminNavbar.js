import React from 'react';
import axios from 'axios';
// nodejs library that concatenates classes
import classNames from 'classnames';
import Notifications, { notify } from 'react-notify-toast';
import jwtDecode from 'jwt-decode';
import socketIOClient from 'socket.io-client';

// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal,
} from 'reactstrap';
const ENDPOINT = 'http://127.0.0.1:5000';

class AdminNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: false,
      modalSearch: false,
      color: 'navbar-transparent',
      notifs: [],
    };
  }

  // handleNotifs = () => {
  //   const token = localStorage.getItem("token");
  //   const user = jwtDecode(token);
  //   axios.get('http://localhost:5000/notification/store').then((response) => {
  //     var notifs = response.data;
  //     console.log(notifs)
  //     var arr = []
  //     for (var i = notifs.length - 1; i >= 0; i--) {
  //       for (var j = 0; j < notifs[i].employees.length; j++)
  //         if (notifs[i].employees[j].label === user.fullname && arr.leng < 5) {
  //           arr.unshift(notifs[i])
  //         }
  //     }
  //     this.setState({ notifs: arr });
  //   });
  // }

  componentDidMount() {
    window.addEventListener('resize', this.updateColor);

    // notifications
    const token = localStorage.getItem('token');
    const user = jwtDecode(token);
    const socket = socketIOClient(ENDPOINT);
    socket.on('messageSent', (msg) => {
      for (var i = 0; i < msg.employees.length; i++) {
        if (msg.employees[i].label === user.fullname) {
          notify.show(
            'New message : ' +
              msg.subject +
              ' meeting in ' +
              msg.date +
              ' From Amine',
            'custom',
            5000,
            { background: '#00ed04', text: '#FFFFFF' }
          );
        }
      }
      axios.get('http://localhost:5000/notification/store').then((response) => {
        var notifs = response.data;
        console.log(notifs);
        var arr = [];
        for (var i = notifs.length - 1; i >= 0; i--) {
          for (var j = 0; j < notifs[i].employees.length; j++)
            if (
              notifs[i].employees[j].label === user.fullname &&
              arr.length < 5
            ) {
              arr.push(notifs[i]);
            }
        }
        this.setState({ notifs: arr });
      });
    });
    axios.get('http://localhost:5000/notification/store').then((response) => {
      var notifs = response.data;
      console.log(notifs);
      var arr = [];
      for (var i = notifs.length - 1; i >= 0; i--) {
        for (var j = 0; j < notifs[i].employees.length; j++)
          if (
            notifs[i].employees[j].label === user.fullname &&
            arr.length < 5
          ) {
            arr.push(notifs[i]);
          }
      }
      this.setState({ notifs: arr });
    });
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateColor);
  }
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  updateColor = () => {
    if (window.innerWidth < 993 && this.state.collapseOpen) {
      this.setState({
        color: 'bg-white',
      });
    } else {
      this.setState({
        color: 'navbar-transparent',
      });
    }
  };
  // this function opens and closes the collapse on small devices
  toggleCollapse = () => {
    if (this.state.collapseOpen) {
      this.setState({
        color: 'navbar-transparent',
      });
    } else {
      this.setState({
        color: 'bg-white',
      });
    }
    this.setState({
      collapseOpen: !this.state.collapseOpen,
    });
  };
  // this function is to open the Search modal
  toggleModalSearch = () => {
    this.setState({
      modalSearch: !this.state.modalSearch,
    });
  };

  //this is a function for logging out the user
  logout = () => {
    localStorage.removeItem('token');
    window.location = '/login';
  };
  render() {
    var notification = this.state.notifs.map((notif, key) => {
      return (
        <NavLink key={key} tag="li">
          <DropdownItem className="nav-item">
            You have a new meeting scheduled for {notif.date}
          </DropdownItem>
        </NavLink>
      );
    });
    return (
      <>
        <Navbar
          className={classNames('navbar-absolute', this.state.color)}
          expand="lg"
        >
          <Container fluid>
            <div className="navbar-wrapper">
              <div
                className={classNames('navbar-toggle d-inline', {
                  toggled: this.props.sidebarOpened,
                })}
              >
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={this.props.toggleSidebar}
                >
                  <span className="navbar-toggler-bar bar1" />
                  <span className="navbar-toggler-bar bar2" />
                  <span className="navbar-toggler-bar bar3" />
                </button>
              </div>
              <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
                {this.props.brandText}
              </NavbarBrand>
            </div>
            <button
              aria-expanded={false}
              aria-label="Toggle navigation"
              className="navbar-toggler"
              data-target="#navigation"
              data-toggle="collapse"
              id="navigation"
              type="button"
              onClick={this.toggleCollapse}
            >
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
            </button>
            <Collapse navbar isOpen={this.state.collapseOpen}>
              <Nav className="ml-auto" navbar>
                <InputGroup className="search-bar">
                  <Button
                    color="link"
                    data-target="#searchModal"
                    data-toggle="modal"
                    id="search-button"
                    onClick={this.toggleModalSearch}
                  >
                    <i className="tim-icons icon-zoom-split" />
                    <span className="d-lg-none d-md-block">Search</span>
                  </Button>
                </InputGroup>
                <Notifications options={{ zIndex: 200, top: '50px' }} />
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    onClick={this.handleNotifs}
                    caret
                    color="default"
                    data-toggle="dropdown"
                    nav
                  >
                    <div className="notification d-none d-lg-block d-xl-block" />
                    <i className="tim-icons icon-bell-55" />
                    <p className="d-lg-none">Notifications</p>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-navbar" right tag="ul">
                    {notification}
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    data-toggle="dropdown"
                    nav
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="photo">
                      <img
                        alt="..."
                        src="https://coursereport-s3-production.global.ssl.fastly.net/rich/rich_files/rich_files/4156/s200/rbk-logo.jpg"
                      />
                    </div>
                    <b className="caret d-none d-lg-block d-xl-block" />
                    <p className="d-lg-none">Log out</p>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-navbar" right tag="ul">
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">Profile</DropdownItem>
                    </NavLink>
                    <NavLink tag="li">
                      <DropdownItem className="nav-item">Settings</DropdownItem>
                    </NavLink>
                    <DropdownItem divider tag="li" />
                    <NavLink tag="li">
                      <DropdownItem className="nav-item" onClick={this.logout}>
                        Log out
                      </DropdownItem>
                    </NavLink>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <li className="separator d-lg-none" />
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        <Modal
          modalClassName="modal-search"
          isOpen={this.state.modalSearch}
          toggle={this.toggleModalSearch}
        >
          <div className="modal-header">
            <Input id="inlineFormInputGroup" placeholder="SEARCH" type="text" />
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={this.toggleModalSearch}
            >
              <i className="tim-icons icon-simple-remove" />
            </button>
          </div>
        </Modal>
      </>
    );
  }
}

export default AdminNavbar;
