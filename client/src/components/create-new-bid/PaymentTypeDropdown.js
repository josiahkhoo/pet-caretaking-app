import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink,
} from "shards-react";

export default class PaymentTypeDropdown extends Component {
  static propTypes = {
    paymentType: PropTypes.string,
    onPaymentTypeChange: PropTypes.func,
  };

  PAYMENT_TYPES = ["Credit Card", "Paynow"];

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    this.togglePaymentType = this.togglePaymentType.bind(this);
  }

  togglePaymentType() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    const { visible } = this.state;
    const { paymentType, onChangePaymentType } = this.props;
    return (
      <NavItem tag={Dropdown} large toggle={this.togglePaymentType}>
        <DropdownToggle caret>
          {paymentType != null ? `${paymentType}` : "Select payment type"}
        </DropdownToggle>
        <Collapse tag={DropdownMenu} open={visible}>
          {this.PAYMENT_TYPES.map((paymentType) => (
            <DropdownItem
              onClick={(item) =>
                onChangePaymentType(item.currentTarget.innerText)
              }
            >
              {paymentType}
            </DropdownItem>
          ))}
        </Collapse>
      </NavItem>
    );
  }
}
