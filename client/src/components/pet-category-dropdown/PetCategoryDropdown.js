import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink,
} from "shards-react";

export default class PetCategoryDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      categories: [],
    };

    this.togglePetCategory = this.togglePetCategory.bind(this);
  }

  togglePetCategory() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  async getPetCategory() {
    try {
      const response = await fetch("http://localhost:5000/categories", {
        method: "GET",
      });
      return await response.json();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  componentDidMount() {
    this.getPetCategory().then((res) => {
      console.log(res);
      this.setState({ categories: res });
    });
    console.log(this.state.categories);
  }

  render() {
    const { categories, visible } = this.state;
    const { selectedCategory } = this.props;
    return (
      <NavItem tag={Dropdown} large toggle={this.togglePetCategory}>
        <DropdownToggle caret>
          {selectedCategory != null ? `${selectedCategory}` : "Select category"}
        </DropdownToggle>
        <Collapse tag={DropdownMenu} open={visible}>
          {categories.map((category) => (
            <DropdownItem
              onClick={(item) =>
                this.props.onChangeCategory(item.currentTarget.innerText)
              }
            >
              {category["name"]}
            </DropdownItem>
          ))}
        </Collapse>
      </NavItem>
    );
  }
}
