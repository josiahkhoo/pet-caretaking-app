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

export default class PetDropdown extends Component {
  static propTypes = {
    petOwnerUserId: PropTypes.number,
    onSelectPetName: PropTypes.func,
    petName: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      pets: [],
    };

    this.togglePet = this.togglePet.bind(this);
  }

  togglePet() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  async getAllPets(petOwnerUserId) {
    try {
      const response = await fetch(
        `http://localhost:5000/pet-owners/${petOwnerUserId}/pets`,
        {
          method: "GET",
        }
      );
      return await response.json();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  componentDidMount() {
    this.getAllPets(this.props.petOwnerUserId).then((res) => {
      console.log(res);
      this.setState({ pets: res });
    });
  }

  render() {
    const { petName } = this.props;
    const { visible, pets } = this.state;
    return (
      <NavItem tag={Dropdown} large toggle={this.togglePet}>
        <DropdownToggle caret>
          {petName != null ? `${petName}` : "Select pet"}
          <i className="material-icons">arrow_drop_down</i>
        </DropdownToggle>
        <Collapse tag={DropdownMenu} open={visible}>
          {pets.map((pet) => (
            <DropdownItem
              onClick={(item) =>
                this.props.onSelectPetName(item.currentTarget.innerText)
              }
            >
              {pet["pname"]}
            </DropdownItem>
          ))}
        </Collapse>
      </NavItem>
    );
  }
}
