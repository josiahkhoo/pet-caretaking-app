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

export default class TransferTypeDropdown extends Component {
  static propTypes = {
    transferType: PropTypes.string,
    onChangeTransferType: PropTypes.func,
  };

  TRANSFER_TYPES = ["Delivery", "Pick Up", "Internal Transfer"];

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    this.toggleTransferType = this.toggleTransferType.bind(this);
  }

  toggleTransferType() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    const { visible } = this.state;
    const { transferType, onChangeTransferType } = this.props;
    return (
      <NavItem tag={Dropdown} large toggle={this.toggleTransferType}>
        <DropdownToggle caret>
          {transferType != null ? `${transferType}` : "Select transfer type"}
        </DropdownToggle>
        <Collapse tag={DropdownMenu} open={visible}>
          {this.TRANSFER_TYPES.map((transferType) => (
            <DropdownItem
              onClick={(item) =>
                onChangeTransferType(item.currentTarget.innerText)
              }
            >
              {transferType}
            </DropdownItem>
          ))}
        </Collapse>
      </NavItem>
    );
  }
}
