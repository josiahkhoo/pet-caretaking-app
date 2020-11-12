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
import CaretakerDropdown from "./CaretakerDropdown";
import moment from "moment";

export default class CreateNewBidForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      petName: null,
      petCategory: null,
      careTakerUserId: null,
      startDate: null,
      endDate: null,
      transferType: null,
      careTakerName: null,
      paymentType: null,
    };
  }

  onSelectPet(pet) {
    console.log(pet.pet_name);
    console.log(pet.category_name);
    this.setState({
      petName: pet.pet_name,
      petCategory: pet.category_name,
    });
    this.resetCareTaker();
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

  onCareTakerChange(careTaker) {
    this.setState({
      careTakerUserId: careTaker.user_id,
      careTakerName: careTaker.name,
    });
    this.props.handleCareTakerChange(careTaker);
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
      petName !== null &&
      careTakerUserId !== null &&
      startDate !== null &&
      endDate !== null &&
      transferType !== null &&
      paymentType !== null
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
    const { petOwnerUserId } = this.props;
    const body = {
      pet_name: petName,
      care_taker_user_id: careTakerUserId,
      start_date: moment(startDate).format("YYYY-MM-DD"),
      end_date: moment(endDate).format("YYYY-MM-DD"),
      transfer_type: transferType,
      payment_type: paymentType,
      pet_owner_user_id: petOwnerUserId,
    };
    try {
      const response = await fetch("/pet-owners/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        this.resetState();
        alert("Success!");
      } else {
        alert("An error has occured");
      }
    } catch (error) {
      alert("An error has occured");
      console.log(error);
    }
  }

  resetCareTaker() {
    this.setState({
      careTakerUserId: null,
      careTakerName: null,
    });
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
      careTakerName,
      startDate,
      endDate,
      transferType,
      paymentType,
      petCategory,
    } = this.state;
    const { petOwnerUserId } = this.props;
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
                petOwnerUserId={petOwnerUserId}
                onSelectPetName={(pet) => this.onSelectPet(pet)}
                petName={petName}
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
              <h6>Caretaker</h6>
              {/* TODO (INSERT SEARCH HERE) */}
              <CaretakerDropdown
                category={petCategory}
                selectedCareTaker={careTakerName}
                startDate={startDate}
                endDate={endDate}
                onSelectCareTaker={(c) => this.onCareTakerChange(c)}
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
