import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  NavItem,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Collapse,
  Dropdown,
} from "shards-react";

export default class MonthDropdown extends Component {
  static propTypes = {
    month: PropTypes.number,
    onChangeMonth: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    this.toggleMonth = this.toggleMonth.bind(this);
  }

  toggleMonth() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    const { visible } = this.state;
    const { month, onChangeMonth } = this.props;
    return (
      <NavItem tag={Dropdown} large toggle={this.toggleMonth}>
        <DropdownToggle caret>
          {month != null ? `${month}` : "Select month"}
        </DropdownToggle>
        <Collapse tag={DropdownMenu} open={visible}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
            <DropdownItem
              onClick={(item) => onChangeMonth(item.currentTarget.innerText)}
            >
              {month}
            </DropdownItem>
          ))}
        </Collapse>
      </NavItem>
    );
  }
}
