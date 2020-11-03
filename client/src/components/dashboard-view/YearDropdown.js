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

export default class YearDropdown extends Component {
  static propTypes = {
    month: PropTypes.number,
    onChangeYear: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    this.toggleYear = this.toggleYear.bind(this);
  }

  toggleYear() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    const { visible } = this.state;
    const { year, onChangeYear } = this.props;
    return (
      <NavItem tag={Dropdown} large toggle={this.toggleYear}>
        <DropdownToggle caret>
          {year != null ? `${year}` : "Select year"}
        </DropdownToggle>
        <Collapse tag={DropdownMenu} open={visible}>
          {[2019, 2020, 2021].map((year) => (
            <DropdownItem
              onClick={(item) => onChangeYear(item.currentTarget.innerText)}
            >
              {year}
            </DropdownItem>
          ))}
        </Collapse>
      </NavItem>
    );
  }
}
