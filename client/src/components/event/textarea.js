import React, {PropTypes, Component} from 'react'

import { Field, reduxForm } from 'redux-form'
const  { DOM: { input, select, textarea } } = React

class TextArea extends Component {

    render(){
        const {name, placeholder, className, touched, error} = this.props;
        return (
            <div>
                <textarea name={name} className={className}  placeholder={placeholder}  {...this.props.input}/>
                {touched && error && <span>{error}</span>}
            </div>
        )
    }
}

export default TextArea;
