import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  Form,
  FormInput,
  FormGroup,
  CardBody,
  CardHeader,
} from "shards-react";

export default class EditPetForm extends Component {
  static propTypes = {
    pet: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      specialRequirements: null,
      imageUrl: null,
    };
  }

  componentDidMount() {
    const { pet } = this.props;
    this.setState({
      specialRequirements: pet.special_requirements,
      imageUrl: pet.image_url,
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

  async updatePet() {
    const { pet } = this.props;
    const { specialRequirements, imageUrl } = this.state;
    const body = {
      special_requirements: specialRequirements,
      image_url: imageUrl,
    };
    try {
      const response = await fetch(
        `/pet-owners/${pet.pet_owner_user_id}/pets/${pet.pet_name}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (response.status === 200) {
        alert("Success!");
      } else {
        alert("An error has occured");
      }
    } catch (error) {
      alert("An error has occured");
      console.log(error);
    }
  }

  render() {
    const { pet } = this.props;
    const { specialRequirements, imageUrl } = this.state;
    return (
      <Card>
        <CardHeader>
          <h4>{pet.pet_name}</h4>
        </CardHeader>
        <CardBody>
          <Form className="edit-pet-form">
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
          </Form>
          <FormGroup>
            <Button onClick={() => this.updatePet()}>
              <i className="material-icons">add</i>Save Changes
            </Button>
          </FormGroup>
        </CardBody>
      </Card>
    );
  }
}
