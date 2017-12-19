import {Link} from 'react-router-dom';
import React, {PropTypes, Component} from 'react'

import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import DateTimeField from 'react-bootstrap-datetimepicker';
import { Field, reduxForm } from 'redux-form'
import EventForm from './event/eventForm';
class AddEvent extends Component{

    static propTypes = {
        placeholder: PropTypes.string,
    }

    static defaultProps = {
        placeholder: ''
    }

    constructor (props) {
        super(props)
        this.state = {
            startDate: moment()
        };
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange (date) {
        this.setState({
            startDate: moment.unix(date/1000).format("YYYY-MM-DD HH:mm")
        });
    }


    componentDidMount() {
        if(!this.props.isAuthenticated){
            this.props.history.push('/login')
        }
    }

    render(){
        return(

            <div className="main-content">
                <h1 className="margin-bottom">Add New Event</h1>
                <EventForm/>
            </div>


        );
    }
}

const mapStateToProps = (state) => {
    return{
        isAuthenticated : state.auth.authenticated
    }
};


export default connect(mapStateToProps, null)(AddEvent);
