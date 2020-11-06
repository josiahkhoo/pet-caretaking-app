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
        `/pet-owners/${petOwnerUserId}/pets-without-userinfo`,
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

  componentDidUpdate(prev) {
    if (this.props.petOwnerUserId === prev.petOwnerUserId) {
      return;
    }
    this.getAllPets(this.props.petOwnerUserId).then((res) => {
      console.log(res);
      if (Array.isArray(res)) {
        this.setState({ pets: res });
      }
    });
  }

  render() {
    const { petName } = this.props;
    const { visible, pets } = this.state;
    return (
      <NavItem tag={Dropdown} large toggle={this.togglePet}>
        <DropdownToggle caret>
          {petName != null ? `${petName}` : "Select pet"}
        </DropdownToggle>
        <Collapse tag={DropdownMenu} open={visible}>
          {pets.map((pet) => (
            <DropdownItem
              onClick={() =>
                this.props.onSelectPetName({
                  pet_name: pet.pet_name,
                  category_name: pet.category_name,
                })
              }
            >
              {pet.pet_name}
            </DropdownItem>
          ))}
        </Collapse>
      </NavItem>
    );
  }
}
