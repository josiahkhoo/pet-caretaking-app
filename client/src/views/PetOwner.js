import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Form,
  Alert,
  Button,
} from "shards-react";
import { Link } from "react-router-dom";

import PageTitle from "../components/common/PageTitle";
import Colors from "../components/components-overview/Colors";
import Checkboxes from "../components/components-overview/Checkboxes";
import RadioButtons from "../components/components-overview/RadioButtons";
import ToggleButtons from "../components/components-overview/ToggleButtons";
import SmallButtons from "../components/components-overview/SmallButtons";
import SmallOutlineButtons from "../components/components-overview/SmallOutlineButtons";
import NormalButtons from "../components/components-overview/NormalButtons";
import NormalOutlineButtons from "../components/components-overview/NormalOutlineButtons";
import Forms from "../components/components-overview/Forms";
import FormValidation from "../components/components-overview/FormValidation";
import CompleteFormExample from "../components/components-overview/CompleteFormExample";
import Sliders from "../components/components-overview/Sliders";
import ProgressBars from "../components/components-overview/ProgressBars";
import ButtonGroups from "../components/components-overview/ButtonGroups";
import InputGroups from "../components/components-overview/InputGroups";
import SeamlessInputGroups from "../components/components-overview/SeamlessInputGroups";
import CustomFileUpload from "../components/components-overview/CustomFileUpload";
import DropdownInputGroups from "../components/components-overview/DropdownInputGroups";
import CustomSelect from "../components/components-overview/CustomSelect";
import OwnedPetsViewTable from "../components/owned-pets-view/OwnedPetsViewTable";
import UserDetails from "../components/user-profile-lite/UserDetails";
import PetOwnerBidTable from "../components/pet-owner-bid-table/PetOwnerBidTable";
import Store from "../flux/store";

export default class PetOwner extends Component {
  static propTypes = {
    prop: PropTypes,
  };

  render() {
    return (
      <div>
        <Container fluid className="main-content-container px-4">
          <Row noGutters className="page-header py-4">
            <PageTitle
              sm="4"
              title="Pet Owner"
              className="text-sm-left"
            />
          </Row>

          <Row>
            <Col lg="8" className="mb-4">
              <OwnedPetsViewTable petOwnerUserId={Store.getUser().user_id} />
            </Col>

            <Col lg="4" className="mb-4">
              <UserDetails user={Store.getUser()} />

              {/* Groups */}
            </Col>
          </Row>

          <PetOwnerBidTable petOwnerUserId={Store.getUser().user_id} />
        </Container>
      </div>
    );
  }
}
