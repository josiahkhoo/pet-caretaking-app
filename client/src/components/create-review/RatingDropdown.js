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

export default class RatingDropdown extends Component {
  static propTypes = {
    rating: PropTypes.number,
    onChangeRating: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    this.toggleRating = this.toggleRating.bind(this);
  }

  toggleRating() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    const { visible } = this.state;
    const { rating, onChangeRating } = this.props;
    return (
      <NavItem tag={Dropdown} large toggle={this.toggleRating}>
        <DropdownToggle caret>
          {rating != null ? `${rating}` : "Select rating"}
        </DropdownToggle>
        <Collapse tag={DropdownMenu} open={visible}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <DropdownItem
              onClick={(item) => onChangeRating(item.currentTarget.innerText)}
            >
              {rating}
            </DropdownItem>
          ))}
        </Collapse>
      </NavItem>
    );
  }
}
