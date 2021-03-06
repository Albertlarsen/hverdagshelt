import React from 'react';
import { Field, reduxForm } from 'redux-form';
import validate from './validate';
import renderField from './renderField';
import renderCategoryField from './renderCategoryField';
import { Button, ProgressBar, Grid, Col } from 'react-bootstrap';
import { ChooseCategory } from '../../../../components/chooseCategory/ChooseCategory';
import { ChooseEventCategory } from '../../../../components/chooseEventCategory/ChooseEventCategory';
import store from './store';
import issueReg from '../../../registerIssue/reduxRegisterForm/issueReg.css';

const renderError = ({ meta: { touched, error } }) =>
  touched && error ? <span>{error}</span> : false;

export class EventFormSecondPage extends React.Component {
  setProps = () => {
    this.props.change('categoryid', this.state.selectedCategoryId);
    this.props.change('categorylevel', this.state.selectedCategoryType);
  };
  onChangeCategoryHeader = (name1, name2) => {
    this.setState(
      { selectedCategoryId: name1, selectedCategoryType: name2 },
      this.setProps.bind(this)
    );
    //this.props.change("categoryid", this.state.selectedCategoryId);
    //  this.props.change("categorylevel", this.state.selectedCategoryType);
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedCategoryId: -1,
      selectedCategoryType: -1
    };
    //  this.handleCategoryClick = this.handleCategoryClick.bind(this);
  }

  /*
  handleCategoryClick = e => {
    this.setState(
      {
        selectedCategoryId: e.selectedCategoryId,
        selectedCategoryType: e.selectedCategoryType
      },
      this.props.change("categoryid", e.selectedCategoryId).bind(this)
    );
    this.props.change("categorylevel", e.selectededCategoryType);
  };
*/
  render() {
    const { handleSubmit, previousPage, onChangeCategoryHeader } = this.props;
    return (
      <Grid>
        <div className="container bottomFooter ">
          <div className="formDiv">

            <Col md={8} mdOffset={2}>


              <div className="progressBar">
                <ProgressBar now={66} label={'2/3'}/>
              </div>
              <ChooseEventCategory
                changeCategoryHeader={this.onChangeCategoryHeader.bind(this)}
                //  onClick={this.handleCategoryClick.bind(this)}
                registerCategory={false}
              />
              <form onSubmit={handleSubmit}>
                <Field
                  name="categoryId"
                  type="hidden"
                  label="categoryid"
                  component={renderCategoryField}
                  defaultValue={this.state.selectedCategory}
                />
                <Field
                  name="categoryLevel"
                  type="hidden"
                  //onChange={this.handleCategoryClick.bind(this)}
                  component={renderCategoryField}
                  label="categorylevel"
                  //defaultValue={this.state.selectedCategoryType}
                />
                <div>
                  <Col lg={6} md={6} sm={6} xs={6}>
                    <Button
                      bsStyle="primary"
                      type="button"
                      className="previous"
                      onClick={previousPage}
                    >
                      Previous
                    </Button>
                  </Col>
                  <Col lg={6} md={6} sm={6} xs={6} align="right">
                    <Button bsStyle="primary" type="submit" className="next">
                      Next
                    </Button>
                  </Col>
                </div>
              </form>
            </Col>
          </div>
        </div>
      </Grid>
    );
  }
}

export default reduxForm({
  form: 'EventWizard', //Form name is same
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate
})(EventFormSecondPage);
