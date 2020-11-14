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
import moment from "moment";
import priceToString from "../../utils/priceToString";

export default class CareTakerDropdown extends Component {
  static propTypes = {
    category: PropTypes.string,
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    selectedCareTaker: PropTypes.object,
    onSelectCareTaker: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      availableCareTakers: [],
    };

    this.toggleCareTaker = this.toggleCareTaker.bind(this);
  }

  toggleCareTaker() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  async getCareTakerAvailableCategoryAndDateRange(
    category,
    startDate,
    endDate
  ) {
    try {
      const res = await fetch(
        `/careTakers/availability/search?category=${category}&start=${moment(
          startDate
        ).format("YYYY-MM-DD")}&end=${moment(endDate).format("YYYY-MM-DD")}`
      );
      if (res.status === 200) {
        return res.json();
      }
      return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  fetchAndSetCareTakers() {
    const { category, startDate, endDate } = this.props;
    if (category !== null && startDate !== null && endDate !== null) {
      this.getCareTakerAvailableCategoryAndDateRange(
        category,
        startDate,
        endDate
      ).then((res) => {
        this.setState({
          availableCareTakers: res,
        });
      });
    }
  }

  componentDidMount() {
    this.fetchAndSetCareTakers();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.category !== this.props.category ||
      prevProps.startDate !== this.props.startDate ||
      prevProps.endDate !== this.props.endDate
    ) {
      this.fetchAndSetCareTakers();
    }
  }

  dateDiff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }

  render() {
    const { visible, availableCareTakers } = this.state;
    const { selectedCareTaker, onSelectCareTaker } = this.props;
    return (
      <NavItem tag={Dropdown} large toggle={this.toggleCareTaker}>
        <DropdownToggle caret>
          {selectedCareTaker != null
            ? `${selectedCareTaker}`
            : "Select caretaker"}
        </DropdownToggle>
        <Collapse tag={DropdownMenu} open={visible}>
          {availableCareTakers !== [] ? (
            availableCareTakers.map((careTaker) => (
              <DropdownItem
                onClick={() =>
                  onSelectCareTaker({
                    name: careTaker.named,
                    user_id: careTaker.userid,
                  })
                }
              >
                {`${careTaker.named} ${priceToString(
                  careTaker.price *
                    (this.dateDiff(this.props.startDate, this.props.endDate) +
                      1)
                )}`}
              </DropdownItem>
            ))
          ) : (
            <DropdownItem>"No careTaker is available"</DropdownItem>
          )}
        </Collapse>
      </NavItem>
    );
  }
}
