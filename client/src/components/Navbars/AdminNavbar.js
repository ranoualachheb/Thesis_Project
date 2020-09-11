import React from 'react';
import axios from 'axios';
// nodejs library that concatenates classes
import classNames from 'classnames';
import Notifications, { notify } from 'react-notify-toast';
import jwtDecode from 'jwt-decode';
import socketIOClient from 'socket.io-client';

// reactstrap components
//..
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
    console.log(user);
    socket.on('messageSent', (msg) => {
      // meeting notif sent to employees
      if (msg.employees && msg.employees.length !== 0) {
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
      }
      // adding feature notif sent to head
      else if (
        msg.featureProgress === 'Sent to the Head of Department' &&
        msg.department === user.department &&
        user.role === 'Head'
      ) {
        notify.show(
          'New message : You have received a new feature',
          'custom',
          5000,
          { background: '#00ed04', text: '#FFFFFF' }
        );
      }
      // creating project notif sent to head
      else if (
        user.role === 'Head' &&
        msg.department === user.department &&
        msg.status === 'Created'
      ) {
        notify.show(
          'New message : You have received a new project',
          'custom',
          5000,
          { background: '#00ed04', text: '#FFFFFF' }
        );
      }
      // declining project notif sent to head
      else if (
        msg.featureStatus === 'Finished' &&
        msg.sentdepartment === 'CEO' &&
        user.department === 'IT'
      ) {
        notify.show(
          'New message : Your feature has been declined by CEO',
          'custom',
          5000,
          { background: 'red', text: '#FFFFFF' }
        );
      }
      // declining project notif sent to employee
      else if (
        user.role !== 'Head' &&
        msg.department === user.department &&
        msg.status === 'Finished'
      ) {
        notify.show(
          'New message : Your feature has been declined by the head of your department',
          'custom',
          5000,
          { background: 'red', text: '#FFFFFF' }
        );
      }

      // sending to methods notif
      else if (
        user.role === 'Head' &&
        msg.receiveddepartment === user.department &&
        msg.receiveddepartment === 'Methods'
      ) {
        notify.show(
          'New message :  You have received a new feature from ' +
            msg.sentdepartment +
            ' department',
          'custom',
          5000,
          { background: '#00ed04', text: '#FFFFFF' }
        );
      }
      // sending to CEO notif
      else if (user.role === 'CEO' && msg.receiveddepartment === 'CEO') {
        notify.show(
          'New message :  You have received a new feature from ' +
            msg.sentdepartment +
            ' department',
          'custom',
          5000,
          { background: '#00ed04', text: '#FFFFFF' }
        );
      }
      // sending to IT notif
      else if (
        user.role === 'Head' &&
        msg.receiveddepartment === user.department &&
        msg.receiveddepartment === 'IT' &&
        msg.sentdepartment === 'CEO'
      ) {
        notify.show(
          'New message :  You have received a new feature from ' +
            msg.sentdepartment +
            ' department',
          'custom',
          5000,
          { background: '#00ed04', text: '#FFFFFF' }
        );
      }
      // sending to IT notif
      else if (
        user.role === 'Head' &&
        msg.receiveddepartment === user.department &&
        msg.receiveddepartment === 'IT'
      ) {
        notify.show(
          'New message :  You have received a new feature from ' +
            msg.sentdepartment +
            ' department',
          'custom',
          5000,
          { background: '#00ed04', text: '#FFFFFF' }
        );
      }

      axios
        .get('http://localhost:5000/notification/retrieve')
        .then((response) => {
          var notifs = response.data;
          console.log(notifs);
          var arr = [];
          for (var i = notifs.length - 1; i >= 0; i--) {
            if (user.role !== 'Head' && user.role !== 'CEO') {
              for (var j = 0; j < notifs[i].employees.length; j++)
                // filter meeting notif
                if (
                  notifs[i].employees[j].label === user.fullname &&
                  arr.length < 5
                ) {
                  arr.push(notifs[i]);
                }
            }
            // filter feature creation notif
            else if (
              user.role === 'Head' &&
              notifs[i].department === user.department &&
              notifs[i].singleSelect &&
              arr.length < 5
            ) {
              arr.push(notifs[i]);
            }
            // filter project sent to methods notif
            else if (
              user.role === 'Head' &&
              notifs[i].receiveddepartment === user.department &&
              notifs[i].receiveddepartment === 'Methods' &&
              arr.length < 5
            ) {
              arr.push(notifs[i]);
            }
            // filter project sent to IT notif
            else if (
              user.role === 'Head' &&
              notifs[i].receiveddepartment === user.department &&
              notifs[i].receiveddepartment === 'IT' &&
              arr.length < 5
            ) {
              arr.push(notifs[i]);
            }
            // filter project sent to CEO notif
            else if (
              user.role === 'CEO' &&
              notifs[i].receiveddepartment === 'CEO' &&
              arr.length < 5
            ) {
              arr.push(notifs[i]);
            }
            // filter feature declined by CEO notif
            else if (
              user.department === 'IT' &&
              notifs[i].featureStatus === 'Finished' &&
              notifs[i].sentdepartment === 'CEO' &&
              arr.length < 5
            ) {
              arr.push(notifs[i]);
            }
            // filter project creation notif
            else if (
              user.role === 'Head' &&
              notifs[i].department === user.department &&
              notifs[i].status === 'Created' &&
              arr.length < 5
            ) {
              arr.push(notifs[i]);
            }
          }
          this.setState({ notifs: arr });
        });
    });
    axios
      .get('http://localhost:5000/notification/retrieve')
      .then((response) => {
        var notifs = response.data;
        console.log(notifs);
        var arr = [];
        for (var i = notifs.length - 1; i >= 0; i--) {
          if (user.role !== 'Head' && user.role !== 'CEO') {
            for (var j = 0; j < notifs[i].employees.length; j++)
              // filter meeting notif
              if (
                notifs[i].employees[j].label === user.fullname &&
                arr.length < 5
              ) {
                arr.push(notifs[i]);
              }
          }
          // filter feature creation notif
          else if (
            user.role === 'Head' &&
            notifs[i].department === user.department &&
            notifs[i].singleSelect &&
            arr.length < 5
          ) {
            arr.push(notifs[i]);
          }
          // filter project sent to methods notif
          else if (
            user.role === 'Head' &&
            notifs[i].receiveddepartment === user.department &&
            notifs[i].receiveddepartment === 'Methods' &&
            arr.length < 5
          ) {
            arr.push(notifs[i]);
          }
          // filter project sent to IT notif
          else if (
            user.role === 'Head' &&
            notifs[i].receiveddepartment === user.department &&
            notifs[i].receiveddepartment === 'IT' &&
            arr.length < 5
          ) {
            arr.push(notifs[i]);
          }
          // filter project sent to CEO notif
          else if (
            user.role === 'CEO' &&
            notifs[i].receiveddepartment === 'CEO' &&
            arr.length < 5
          ) {
            arr.push(notifs[i]);
          }
          // filter feature declined by CEO notif
          else if (
            user.department === 'IT' &&
            notifs[i].featureStatus === 'Finished' &&
            notifs[i].sentdepartment === 'CEO' &&
            arr.length < 5
          ) {
            arr.push(notifs[i]);
          }
          // filter project creation notif
          else if (
            user.role === 'Head' &&
            notifs[i].department === user.department &&
            notifs[i].status === 'Created' &&
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
    console.log(this.state.notifs);
    var notification = this.state.notifs.map((notif, key) => {
      if (notif.employees.length !== 0) {
        return (
          <NavLink key={key} tag="li">
            <DropdownItem className="nav-item">
              You have a new meeting scheduled for {notif.date}
            </DropdownItem>
          </NavLink>
        );
      } else if (notif.status) {
        return (
          <NavLink key={key} tag="li">
            <DropdownItem className="nav-item">
              You have received a new project {notif.progress}
            </DropdownItem>
          </NavLink>
        );
      } else if (notif.featureStatus === 'Finished') {
        return (
          <NavLink key={key} tag="li">
            <DropdownItem className="nav-item">
              Your feature has been declined by CEO
            </DropdownItem>
          </NavLink>
        );
      } else if (notif.singleSelect) {
        return (
          <NavLink key={key} tag="li">
            <DropdownItem className="nav-item">
              You have received a new feature {notif.featureProgress}
            </DropdownItem>
          </NavLink>
        );
      } else if (notif.receiveddepartment && notif.sentdepartment !== 'CEO') {
        return (
          <NavLink key={key} tag="li">
            <DropdownItem className="nav-item">
              You have received a new feature from {notif.sentdepartment}{' '}
              department
            </DropdownItem>
          </NavLink>
        );
      } else if (notif.receiveddepartment) {
        return (
          <NavLink key={key} tag="li">
            <DropdownItem className="nav-item">
              You have received a new feature from {notif.sentdepartment}
            </DropdownItem>
          </NavLink>
        );
      }
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
                {/* <InputGroup className="search-bar">
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
                </InputGroup> */}
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
                    {/* <NavLink tag="li">
                      <DropdownItem className="nav-item">Settings</DropdownItem>
                    </NavLink> */}
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
