import React from "react";
import { Nav } from "shards-react";

import Notifications from "./Notifications";
import UserActions from "./UserActions";

import { Store } from "../../../../flux";

class NavbarNav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: Store.getUser(),
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    Store.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    Store.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      ...this.state,
      user: Store.getUser(),
    });
  }

  render() {
    return (
      <Nav navbar className="border-left flex-row">
        <Notifications />
        <UserActions user={this.state.user} />
      </Nav>
    );
  }
}
export default NavbarNav;
