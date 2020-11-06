import React, { Component } from "react";
import PropTypes from "prop-types";
import { Rating } from "@material-ui/lab";

export default class CaretakerInfo extends Component {
  static propTypes = {
    careTakerUserId: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      rating: 0,
    };
  }

  async getCategories() {
    try {
      const response = await fetch(
        `/caretakers/${this.props.careTakerUserId}/categories`
      );
      return await response.json().then((res) => {
        if (Array.isArray(res)) {
          return res;
        }
        return [{ category_name: "Cannot take care of any category" }];
      });
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getAverageRating() {
    try {
      const response = await fetch(
        `/caretakers/${this.props.careTakerUserId}/average-rating`
      );
      return await response.json().then((res) => {
        if (typeof res === "object" && res !== null) {
          return res.avg;
        }
        return 0;
      });
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  componentDidMount() {
    this.getCategories().then((res) =>
      this.setState({
        categories: res,
      })
    );
    this.getAverageRating().then((res) =>
      this.setState({
        rating: res,
      })
    );
  }

  render() {
    const { categories, rating } = this.state;
    return (
      <div>
        <div style={{ justifyContent: "center", display: "flex" }}>
          <Rating value={rating} precision={0.1} readOnly />
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 10 }}
        >
          {categories.map((category) => (
            <div
              className="bg-secondary text-white text-center rounded p-1"
              style={{
                boxShadow: "inset 2 2 2px rgba(0,0,0,.1)",
                marginLeft: 5,
                marginRight: 5,
              }}
            >
              {category.category_name}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
