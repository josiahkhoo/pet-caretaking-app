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
import TransferTypeDropdown from "./TransferTypeDropdown";
import PaymentTypeDropdown from "./PaymentTypeDropdown";

export default class CreateNewBidForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      petName: null,
      careTakerUserId: null,
      startDate: null,
      endDate: null,
      transferType: null,
      paymentType: null,
    };
  }

  //TODO: Place holder value
  userId = 1;

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

  onTransferTypeChange(transferType) {
    this.setState({
      transferType: transferType,
    });
  }

  onPaymentTypeChange(paymentType) {
    this.setState({
      paymentType: paymentType,
    });
  }

  isValidBid(
    petName,
    careTakerUserId,
    startDate,
    endDate,
    transferType,
    paymentType
  ) {
    return (
      petName != null &&
      careTakerUserId != null &&
      startDate != null &&
      endDate != null &&
      transferType != null &&
      paymentType != null
    );
  }

  async createBid() {
    const {
      petName,
      careTakerUserId,
      startDate,
      endDate,
      transferType,
      paymentType,
    } = this.state;
    // TODO: Retrieve USER ID
    const body = {
      pet_name: petName,
      care_taker_user_id: careTakerUserId,
      start_date: startDate,
      end_date: endDate,
      transfer_type: transferType,
      payment_type: paymentType,
      pet_owner_user_id: this.userId,
    };
    try {
      const response = await fetch("http://localhost:5000/pet-owners/bid", {
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
      petName: null,
      careTakerUserId: null,
      startDate: null,
      endDate: null,
      transferType: null,
      paymentType: null,
    });
  }

  render() {
    const {
      petName,
      careTakerUserId,
      startDate,
      endDate,
      transferType,
      paymentType,
    } = this.state;
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
                petOwnerUserId={this.userId}
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
            <FormGroup>
              <h6>Transfer Type</h6>
              <TransferTypeDropdown
                transferType={transferType}
                onChangeTransferType={(transferType) =>
                  this.onTransferTypeChange(transferType)
                }
              />
            </FormGroup>
            <FormGroup>
              <h6>Payment Type</h6>
              <PaymentTypeDropdown
                paymentType={paymentType}
                onChangePaymentType={(paymentType) =>
                  this.onPaymentTypeChange(paymentType)
                }
              />
            </FormGroup>
            <FormGroup></FormGroup>
          </Form>
          {this.isValidBid(
            petName,
            careTakerUserId,
            startDate,
            endDate,
            transferType,
            paymentType
          ) ? (
            <Button onClick={() => this.createBid()}>
              <i className="material-icons">add</i>Create Bid
            </Button>
          ) : (
            <Button disabled>
              <i className="material-icons">add</i>Create Bid
            </Button>
          )}
        </CardBody>
      </Card>
    );
  }
}
