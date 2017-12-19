import React, {PropTypes, Component} from 'react'

import { Field, reduxForm } from 'redux-form'
const  { DOM: { input, select, textarea } } = React

class TextBox extends Component {

    render(){
        const {type, name, placeholder, className, touched, error} = this.props;
        return (
            <div>
                <input name={name} type={type}  className={className}  placeholder={placeholder}  {...this.props.input}/>
                {touched && error && <span>{error}</span>}
            </div>
        )
    }
}
export default TextBox;
