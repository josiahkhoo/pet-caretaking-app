import React, { Component } from "react";
import {
  Col,
  Card,
  CardBody,
  Form,
  Button,
  FormInput,
  FormGroup,
  CardHeader,
} from "shards-react";
import PetCategoryDropdown from "../pet-category-dropdown/PetCategoryDropdown";

export default class AddNewPetForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      petName: "",
      category: null,
      specialRequirements: null,
      imageUrl: null,
    };
  }

  onChangeCategory(category) {
    this.setState({
      category: category,
    });
  }

  setPetName(name) {
    this.setState({
      petName: name,
    });
  }

  setSpecialRequirements(specialRequirements) {
    this.setState({
      specialRequirements: specialRequirements,
    });
  }

  setImageUrl(url) {
    this.setState({
      imageUrl: url,
    });
  }

  async addPet() {
    // TODO: RETRIEVE USER ID AND INJECT HERE
    const { petName, category, specialRequirements, imageUrl } = this.state;
    const body = {
      pet_owner_user_id: this.props.petOwnerUserId,
      pet_name: petName,
      category_name: category,
      special_requirements: specialRequirements,
      image_url: imageUrl,
    };
    try {
      const response = await fetch("http://localhost:5000/pet-owners/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        this.resetState();
      }
    } catch (error) {
      console.log(error);
    }
  }

  resetState() {
    this.setState({
      petName: "",
      category: null,
      specialRequirements: null,
      imageUrl: null,
    });
  }

  render() {
    const { petName, category, specialRequirements, imageUrl } = this.state;
    return (
      <Card>
        <CardHeader>
          <h4>Add a pet</h4>
        </CardHeader>
        <CardBody>
          <Form className="add-new-pet">
            <FormGroup>
              <h6>Pet Name</h6>
              <FormInput
                placeholder="Your pet name"
                onChange={(e) => this.setPetName(e.target.value)}
                value={petName}
              />
            </FormGroup>
            <FormGroup>
              <h6>Pet Category</h6>
              <PetCategoryDropdown
                selectedCategory={category}
                onChangeCategory={(category) => this.onChangeCategory(category)}
              />
            </FormGroup>
            <FormGroup>
              <h6>Special Requirements</h6>
              <FormInput
                placeholder="Special requirements"
                onChange={(e) => this.setSpecialRequirements(e.target.value)}
                value={specialRequirements}
              />
            </FormGroup>
            <FormGroup>
              <h6>Image</h6>
              <FormInput
                type="url"
                placeholder="Image url"
                onChange={(e) => this.setImageUrl(e.target.value)}
                value={imageUrl}
              />
            </FormGroup>
            <FormGroup>
              {petName != "" && category != null ? (
                <Button onClick={() => this.addPet()}>
                  <i className="material-icons">add</i>Add Pet
                </Button>
              ) : (
                <Button disabled>
                  <i className="material-icons">add</i>Add Pet
                </Button>
              )}
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    );
  }
}
