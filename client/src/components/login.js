import {Link} from 'react-router-dom';
import React, {PropTypes} from 'react'
import { login } from '../actions/login'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { browserHistory } from 'react-router';
import * as actions from '../actions';
import { reduxForm, Field } from 'redux-form'
const renderField = props => (
    <div>
            <input className="form-control"  type={props.type} {...props.input}/>
            {props.touched && props.error && <span>{props.error}</span>}
    </div>
)

class Login extends React.Component{

    static propTypes = {
        history: PropTypes.object.isRequired
    }
    handleFormSubmit({email, password}) {
         this.props.signinUser({ email, password },(path)=>{
             this.props.history.push(path)
         });
    }

    constructor(props, context) {
        super(props, context);
        // this.setDefaultObject();
    }

    setDefaultObject(){
        let defaultData = {
            email : '',
            password : ''
        };
        this.state = {
            loginData : defaultData,
            errorData: {
                error : false,
                message : ''
            }
        }
    }

    handleChange(event) {
        let field_name = event.target.name;

        let loginData = Object.assign({}, this.state.loginData);    //creating copy of object
        loginData[field_name] = event.target.value;                        //updating value
        this.setState({loginData});
    }

    renderAlert() {
        if (this.props.errorMessage) {
            return (
                <div className="alert alert-danger">
                    <strong>Oops!</strong> {this.props.errorMessage}
                </div>
            );
        }
    }

    render(){

        const { handleSubmit, fields: { email, password }} = this.props;
        return(
            <div className="container">
                <div className="col-sm-6 col-sm-offset-3">
                    <h1>Login</h1>

                    {this.props.errorMessage ? <div className="alert alert-danger">{this.props.errorMessage}</div> : ''}

                    <form action="/login" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                        <div className="form-group">
                            <label>Email</label>
                            <Field name="email" type="text" component={renderField} placeholder="Email"/>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <Field name="password" type="password" component={renderField} placeholder="Password"/>
                        </div>
                        {/*{this.renderAlert()}*/}
                        <button type="submit" className="btn btn-info">Login</button>
                    </form>

                    <hr/>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { errorMessage: state.auth.error };
}

// function mapStateToProps(state) {
//     return{
//         loggedUser: state.data.loggedUser
//     }
// }
//
//
// function mapDispatchToProps(dispatch){
//     return bindActionCreators({login},dispatch)
// }

Login = reduxForm({
    form: 'signin',
    fields: ['email', 'password']
})(Login)

export default connect(mapStateToProps, actions)(Login)
