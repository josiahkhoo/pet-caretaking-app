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
        `http://localhost:5000/careTakers/availability/search?category=${category}&start=${moment(
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

  render() {
    const { visible, availableCareTakers } = this.state;
    const { selectedCareTaker, onSelectCareTaker } = this.props;
    return (
      <NavItem tag={Dropdown} large toggle={this.toggleCareTaker}>
        <DropdownToggle caret>
          {selectedCareTaker != null
            ? `${selectedCareTaker}`
            : "Select careTaker"}
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
                {careTaker.named}
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
