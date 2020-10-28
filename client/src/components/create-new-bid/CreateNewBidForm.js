import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Form,
  FormInput,
  Button,
} from "shards-react";
import PetDropdown from "../pet-dropdown/PetDropdown";
import RangeDatePicker from "../common/RangeDatePicker";

export default class CreateNewBidForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      petName: null,
      careTakerUserId: null,
      startDate: null,
      endDate: null,
    };
  }

  onSelectPetName(petName) {
    this.setState({
      petName: petName,
    });
  }

  onStartDateChange(date) {
    this.setState({
      startDate: date,
    });
  }

  onEndDateChange(date) {
    this.setState({
      endDate: date,
    });
  }

  onCareTakerChange(id) {
    this.setState({
      careTakerUserId: id,
    });
  }

  isValidBid(petName, careTakerUserId, startDate, endDate) {
    return (
      petName != null &&
      careTakerUserId != null &&
      startDate != null &&
      endDate != null
    );
  }

  render() {
    const { petName, careTakerUserId, startDate, endDate } = this.state;
    return (
      <Card>
        <CardHeader>
          <h4>Create Bid</h4>
        </CardHeader>
        <CardBody>
          <Form className="create-new-bid">
            <FormGroup>
              <h6>Pet</h6>
              <PetDropdown
                petOwnerUserId={1}
                onSelectPetName={(name) => this.onSelectPetName(name)}
                petName={petName}
              />
            </FormGroup>
            <FormGroup>
              <h6>Caretaker</h6>
              {/* TODO (INSERT SEARCH HERE) */}
              <FormInput
                onChange={(e) => this.onCareTakerChange(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <h6>Period</h6>
              <RangeDatePicker
                startDate={startDate}
                endDate={endDate}
                handleStartDateChange={(date) => this.onStartDateChange(date)}
                handleEndDateChange={(date) => this.onEndDateChange(date)}
              />
            </FormGroup>
            <FormGroup></FormGroup>
          </Form>
          {this.isValidBid(petName, careTakerUserId, startDate, endDate) ? (
            <Button>Create Bid</Button>
          ) : (
            <Button disabled>Create Bid</Button>
          )}
        </CardBody>
      </Card>
    );
  }
}
