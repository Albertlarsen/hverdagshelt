import { Col, Button, Form, FormGroup, Label, Overlay, Tooltip} from 'react-bootstrap';
import { CountyService, UserService} from '../../services';
import { Component } from 'react';
import * as React from 'react';
import { Alert } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import { County } from '../../classTypes';
import DropdownButton from 'react-bootstrap/es/DropdownButton';
import MenuItem from 'react-bootstrap/es/MenuItem';
import Grid from 'react-bootstrap/es/Grid';
import { FormControl, PageHeader } from 'react-bootstrap';
import Checkbox from 'react-bootstrap/es/Checkbox';
import Select from 'react-select';
import HelpBlock from "react-bootstrap/es/HelpBlock";
import Row from 'react-bootstrap';
import {history} from "../../index";

let countyService = new CountyService();
let userService = new UserService();

interface State {
    registerSuccess: boolean,
    errorSomething: boolean,
  errorEqualsPass: boolean,
  errorRequirementsPass: boolean,
  errorEmailRequirement: boolean,
  mail: string;
  firstName: string;
  lastName: string;
  password: string;
  password2: string;
  typeName: string;
  phone: string;
  points: number;
  countyId: number;
  countyName: string;
  active: number;
  isLoaded: boolean;
}

interface Props {
  match: Object,
}

export class RegisterUser extends Component<Props, State> {

    /*state = {
        mail: "",
        firstName: "",
        lastName: "",
        postnumber: 0,
        password: "",
        password2: "",
        typeName: "",
        phone: 0,
        points: 0,
        active: 0,
        isLoaded: false,
    };*/
    constructor(props) {
        super(props);
        this.state = {
            registerSuccess: false,
            errorSomething: false,
            errorEqualsPass: false,
            errorRequirementsPass: false,
            errorEmailRequirement: false,
            errorEmailEquality: false,
            mail: '',
            mail2: '',
            firstName: '',
            lastName: '',
            postnumber: 0,
            password: '',
            password2: '',
            typeName: '',
            phone: '',
            show: true,
            points: 0,
            active: 0,
            isLoaded: false,
            choosen: {label: "", countyId: ""},
            countyIsChanged: false,
            values: [
                {label: 'Bergen', countyId: 1}
                //{ name: this.county.name, countyId: this.county.countyId}
            ]
        };

        this.handleChangeCounty = this.handleChangeCounty.bind(this);
    }

    getTarget() {
        return ReactDOM.findDOMNode(this.target);
    }

    handleToggle() {
        this.setState({show: !this.state.show});
    }


    handleChangeCounty(e: Object) {
        this.setState({
            choosen: JSON.parse(e.value),
            countyIsChanged: true
        });
    };

    componentWillMount() {
        var arr = [];
        countyService
            .getCounties()
            .then(county2 => {
                county2.map(e => {
                    var elem = {
                        name: e.name,
                        countyId: e.countyId
                    };
                    arr = arr.concat(elem);

                });
                this.setState({
                    values: arr
                });
            })

            .catch((error: Error) => Alert.danger(error.message));

    }

    handleStringChange = (name: string) => (event: SyntheticEvent<HTMLInputElement>) => {


        this.setState({

            // $FlowFixMe
            [name]: event.target.value
        });
    };

    handleNumberChange = (value: number) => (event: SyntheticEvent<HTMLInputElement>) => {
        const re = /^[0-9\b]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({
                // $FlowFixMe
                [value]: event.target.value
            });
        }
    };

    checkValidEmail() {
        var validator = require('email-validator');
        if (!(validator.validate(this.state.mail))) {
            return false;
        } else return true;
    }

    checkEmailEquality() {
        if (this.state.mail !== this.state.mail2) {
            return false;
        } else if (this.state.mail === this.state.mail2) {
            return true;
        } else {
            return false;
        }
    }

    checkMail = () => {
        var validator = require('email-validator');
        if (!(validator.validate(this.state.mail))) {
            Alert.warning('Eposten eksisterer ikke');
        } else {
            this.checkPass();
        }
    };

    getValidationStateEmail() {
        var validator = require('email-validator');
        const length = this.state.mail.length;
        const bool = validator.validate(this.state.mail);
        if (length == 0) return;
        else if (!(bool)) return 'warning';
        else if (bool) return 'success';
    }

    getValidationStateEmail2() {
        var validator = require('email-validator');
        const length = this.state.mail2.length;
        const bool = validator.validate(this.state.mail2);
        if (length == 0) return;
        else if (!(bool)) return 'warning';
        else if (bool && this.state.mail === this.state.mail2) return 'success';
        else return 'warning';
    }


    checkPasswordEquality() {
        if (this.state.password !== this.state.password2) {
            return false;
        } else return true;
    };

    checkPasswordRequirements() {
        let decimal = /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!., /@<>"¤=#$%^&*()]*$/;
        if (this.state.password.match(decimal)) {
            this.register();
        }
    };

    checkPass = () => {
        if (this.state.password !== this.state.password2) {
            console.log('To ulike passord');
            Alert.warning('Gjenta passord matcher ikke passord');
        }
        else {
            let decimal = /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!., /@<>"¤=#$%^&*()]*$/;
            if (this.state.password.match(decimal)) {
                this.register();
            }
            else {
                console.log("passord må ha tegn osv")
                Alert.warning('Password has to be between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character');
            }
        }
    };


    getValidationStatePassword() {
        const length = this.state.password.length;
        let decimal = /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!., æøå/@<>"¤=#$%^&*()]*$/;
        if (this.state.password.match(decimal)) return 'success';
        else if (length == 0) return;
        else return 'warning';
    }

    getValidationStatePassword2() {
        const password2Length = this.state.password2.length;
        if (password2Length == 0) return;
        else {
            if (this.state.password !== this.state.password2) return 'warning';
            else return 'success';
        }
    }

    getValidationStateFirstName() {
        const firstNameLength = this.state.firstName.length;
        let decimal = /^[A-Za-z _æøå]*[A-Za-zæøå][A-Za-z _æøå]*$/;

        if (firstNameLength === 1) {
            return 'warning';
        } else if (firstNameLength === 0) return;
        else if (this.state.firstName.match(decimal)) {
            return 'success';
        } else {
            return 'warning'
        }
    }

    getValidationStateLastName() {
        const lastNameLength = this.state.lastName.length;
        let dec = /^[A-Za-z _æøå]*[A-Za-z][A-Za-z _æøå]*$/;

        if (lastNameLength === 1) {
            return 'warning';
        } else if (lastNameLength === 0) {
            return
        } else if (this.state.firstName.match(dec)) {
            return 'success';
        } else {
            return 'warning'
        }
    }

    getValidationPhone() {
        const phoneLength = this.state.phone.length;
        let decimal = /^(\d|,)*\d*$/;
        if (phoneLength == 8 && this.state.phone.match(decimal) && ((this.state.phone.charAt(0) == (4)) || this.state.phone.charAt(0) == 9)) {
            return 'success';
        }
        else if (phoneLength == 0) return;
        else {
            return 'warning';
        }
    }


    render() {
        let optionTemplate = this.state.values.map(v => {
            const data = {label: v.name, value: v.countyId, countyId: v.countyId};
            return (data);
        });
        let alert_notequalpasswords;
        if (this.state.errorEqualsPass) {
            alert_notequalpasswords = (
                <Alert bsStyle="danger">
                    <h6>Gjenta passord matcher ikke passord. Prøv igjen!</h6>
                </Alert>);
        } else {
            alert_notequalpasswords = (
                <p></p>
            );
        }
        let register_success;
        if (this.state.registerSuccess) {
            register_success = (
                <Alert bsStyle="success">
                    <p>Bruker ble registrert</p>
                </Alert>
            )
        }

        let alert_notpasswordreq;
        if (this.state.errorRequirementsPass) {
            alert_notpasswordreq = (
                <Alert bsStyle="danger">
                    <h6>Passord må ha en lengde på minst 8 tegn og inneholde minst et tall, en stor og en liten
                        bokstav </h6>
                </Alert>);
        } else {
            alert_notpasswordreq = (
                <p></p>
            );
        }

        let alert_notequalemails;
        if (this.state.errorEmailEquality) {
            alert_notequalemails = (
                <Alert bsStyle="danger">
                    <h6>Gjenta epost og epost matcher ikke. Prøv igjen!</h6>
                </Alert>);
        } else {
            alert_notequalemails = (
                <p></p>
            );
        }
        let alert_notvalidemail;
        if (this.state.errorEmailRequirement) {
            alert_notvalidemail = (
                <Alert bsStyle="danger">
                    <h6>Emailen finnes ikke. Prøv igjen!</h6>
                </Alert>);
        } else {
            alert_notvalidemail = (
                <p></p>
            );
        }
        let alert_something;
        if (this.state.errorSomething) {
            alert_something = (
                <Alert bsStyle="danger">
                    <h6>Pass på at alle felt er fylt ut korrekt</h6>
                </Alert>);
        } else {
            alert_something = (
                <p></p>
            );
        }
        return (
            <Grid>
                <Col md={3}></Col>
                <Col md={6}>
                    <Form horizontal>
                        <FormGroup controlId="formHorizontalEmail">
                            <FormGroup>
                                <FormGroup>
                                    <Col md={3}></Col>
                                    <Col md={6}>
                                        <PageHeader>
                                            Registrer bruker
                                        </PageHeader>
                                    </Col>
                                    <Col md={3}></Col>
                                </FormGroup>
                                <Col md={6}>
                                    <FormGroup validationState={this.getValidationStateFirstName()}>
                                        <FormControl type="text" value={this.state.firstName} placeholder="Fornavn"
                                                     onChange={this.handleStringChange('firstName')}
                                        />
                                        <FormControl.Feedback/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup validationState={this.getValidationStateLastName()}>
                                        <FormControl type="text" value={this.state.lastName} placeholder="Etternavn"
                                                     onChange={this.handleStringChange('lastName')}/>
                                        <FormControl.Feedback/>
                                    </FormGroup>
                                </Col>

                                <Col md={6}>
                                    <FormGroup validationState={this.getValidationStateEmail()}>
                                        <FormControl type="text" value={this.state.mail} placeholder="Epost"
                                                     onChange={this.handleStringChange('mail')}/>
                                        <FormControl.Feedback/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup validationState={this.getValidationStateEmail2()}>
                                        <FormControl type="text" value={this.state.mail2} placeholder="Gjenta epost"
                                                     onChange={this.handleStringChange('mail2')}/>
                                        <FormControl.Feedback/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup validationState={this.getValidationStatePassword()}>
                                        <FormControl type="password" value={this.state.password} placeholder="Passord"
                                                     onChange={this.handleStringChange('password')}>
                                        </FormControl>
                                        <FormControl.Feedback/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup validationState={this.getValidationStatePassword2()}>
                                        <FormControl type="password" value={this.state.password2}
                                                     placeholder="Gjenta passord"
                                                     onChange={this.handleStringChange('password2')}/>
                                        <FormControl.Feedback/>
                                    </FormGroup>
                                </Col>
                                <Col md={12}>
                                    <HelpBlock>Passord må ha en lengde på 8 tegn og inneholde minst et tall, en stor og
                                        en liten bokstav</HelpBlock>
                                </Col>
                                <Col md={6}>
                                    <FormGroup validationState={this.getValidationPhone()}>
                                        <FormControl type="text" value={this.state.phone} placeholder="Telefonnummer"
                                                     onChange={this.handleNumberChange('phone')}
                                        />
                                        <FormControl.Feedback/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Select
                                            placeholder={'Hjemmekommune'}
                                            name="colors"
                                            options={optionTemplate}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            onChange={this.handleChangeCounty}
                                        />
                                    </FormGroup>
                                </Col>

                                <Col md={4}>
                                </Col>

                                <Col md={4}>
                                    <FormGroup>
                                        {alert_something}
                                        {register_success}
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col md={4}/>
                                <Col md={4}>
                                    <Button type="button" onClick={this.checkInput}>Registrer</Button>
                                </Col>
                                <Col md={4}>
                                </Col>
                            </FormGroup>
                        </FormGroup>
                    </Form>
                </Col>
                <Col md={3}></Col>
            </Grid>
        );
    }

    checkInput = () => {
        //console.log(this.getValidationStateFirstName()||this.getValidationStateFirstName()==='warning'||this.getValidationStateLastName()==='warning'||this.getValidationPhone()==='warning'||this.getValidationStateEmail()||this.getValidationStateEmail2()==='warning'||this.getValidationStatePassword()==='warning'||this.getValidationStatePassword2()==='warning');
        if ((this.state.countyIsChanged===false)|| this.getValidationStateFirstName() === 'warning' || this.getValidationStateFirstName() === 'warning' || this.getValidationStateFirstName() === 'warning' || this.getValidationStateLastName() === 'warning' || this.getValidationPhone() === 'warning' || this.getValidationStateEmail() === 'warning' || this.getValidationStateEmail2() === 'warning' || this.getValidationStatePassword() === 'warning' || this.getValidationStatePassword2() === 'warning') {
            this.setState({errorSomething: true});
        }else{
                this.register();
            }
    };


    register = () => {

        const newUser = {
            mail: this.state.mail,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            password: this.state.password,
            typeName: 'Private',
            phone: this.state.phone,
            countyId: this.state.choosen
        };

        console.log("JESSSSSSSS");


        userService
            .addUser(newUser)
            .then(user => (this.state = user))
            .catch((error: Error) => Alert.danger(error.message));

        let theBody: Object = {
            countyId: newUser.countyId,
            userMail: newUser.mail
        };


        countyService.addSubscription(theBody)
        this.setState({errorSomething: false, registerSuccess: true});
        this.goToLogin();
    };

    goToLogin = () => {
        setTimeout(
            function () {
                history.push('/login');
            }, 4000
        )
    }
}

/*
if(this.getValidationStateEmail()==='warning'){
    this.setState({
        errorEmailRequirement:true
    });
    console.log("HEYHO")
}
console.log("truls")
if(!(this.checkEmailEquality())){
    this.setState({
        errorEmailEquality: true
    });
}
console.log("reidar")
if(!(this.checkPasswordRequirements())){
    this.setState({
        errorRequirementsPass: true
    });
}
console.log("Sjekk godkjent")
console.log("pass equals: "+this.checkPasswordEquality());

if(!(this.checkPasswordEquality())){
    console.log("check Password equality");
    this.setState({
        errorEqualsPass: true

    });
}
this.getValidationStateFirstName()==='warning'||this.getValidationStateLastName()==='warning'||this.getValidationPhone()==='warning'||this.getValidationStateEmail()||this.getValidationStateEmail2()==='warning'||this.getValidationStatePassword()==='warning'||this.getValidationStatePassword2()==='warning'
*/