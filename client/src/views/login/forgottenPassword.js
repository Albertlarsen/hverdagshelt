//@flow
import { MailService } from '../../services';
import { Component } from 'react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Button, Form, FormControl, FormGroup, Grid, Col } from 'react-bootstrap';
import { history } from '../../index';

let mailService = new MailService();

export class ForgottenPassword extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      email: { to: '' }
    };
  }

  handleStringChange = () => (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      email: { to: event.target.value }
    });
  };

  buttonBack() {
    this.props.history.goBack();
  }

  render() {
    return (
      <div>
        <i id="backButton" onClick={() => this.buttonBack()} className="fas fa-arrow-circle-left"></i>
        <div className="container bottomFooter forgottenPassword">
          <Grid>

            <Col md={6} smOffset={3}>

              <h2>Glemt passord</h2>
              <p>Skriv inn eposten din og få tilsendt et nytt passord på mail.</p>
              <Form>
                <FormGroup validationState={this.getValidationStateEmail()}>
                  <div className="textfield">
                    <FormControl
                      value={this.state.email.to}
                      onChange={this.handleStringChange()}
                      placeholder="Epost"
                    />
                    <FormControl.Feedback/>
                  </div>
                </FormGroup>
                <Button bsStyle="primary" onClick={this.resetPassword}>
                  Tilbakestill passord
                </Button>
              </Form>

            </Col>
          </Grid>
        </div>
      </div>
    );
  }

  getValidationStateEmail() {
    var validator = require('email-validator');
    const length = this.state.email.to.length;
    const bool = validator.validate(this.state.email.to);
    if (length == 0) return;
    else if (!bool) return 'warning';
    else if (bool) return 'success';
  }

  resetPassword = () => {
    mailService.sendResetPasswordMail({ to: this.state.email.to });
    history.push('/login');
  };
}
