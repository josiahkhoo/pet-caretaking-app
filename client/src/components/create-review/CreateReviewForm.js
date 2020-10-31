import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  FormInput,
  Row,
  Button,
} from "shards-react";
import RatingDropdown from "./RatingDropdown";
import moment from "moment";

export default class CreateReviewForm extends Component {
  static propTypes = {
    bid: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      rating: null,
      review: null,
    };
  }

  onChangeRating(rating) {
    this.setState({
      rating: rating,
    });
  }

  onChangeReview(review) {
    this.setState({
      review: review,
    });
  }

  isValidReview(rating, review) {
    return rating !== null && review !== null && review !== "";
  }

  async createReview() {
    const { rating, review } = this.state;
    const { bid } = this.props;
    // TODO: PARSE START DATE AND END DATE INTO "YYYY-MM-DD"
    const body = {
      pet_owner_user_id: bid.pet_owner_user_id,
      pet_name: bid.pet_name,
      start_date: moment(bid.start_date).format("YYYY-MM-DD"),
      end_date: moment(bid.end_date).format("YYYY-MM-DD"),
      care_taker_user_id: bid.care_taker_user_id,
      rating: rating,
      review: review,
    };
    try {
      const response = await fetch(
        "http://localhost:5000/pet-owners/bid/review",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (response.status === 200) {
        this.resetState();
      }
    } catch (error) {
      console.log(error);
    }
  }

  resetState() {
    this.setState({ rating: null, review: null });
  }

  render() {
    const { rating, review } = this.state;
    return (
      <Card>
        {/* <CardHeader>
          <h4>Create Review</h4>
        </CardHeader> */}
        <CardBody>
          <Form>
            <FormGroup>
              <h6>Rating</h6>
              <RatingDropdown
                rating={rating}
                onChangeRating={(rating) => this.onChangeRating(rating)}
              />
            </FormGroup>
            <FormGroup>
              <h6>Review</h6>
              <FormInput
                onChange={(e) => this.onChangeReview(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              {this.isValidReview(rating, review) ? (
                <Button onClick={() => this.createReview()}>Submit</Button>
              ) : (
                <Button disabled>Submit</Button>
              )}
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    );
  }
}
