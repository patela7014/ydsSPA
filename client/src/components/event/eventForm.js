import React, {PropTypes, Component} from 'react'

import { Field, reduxForm } from 'redux-form'
const  { DOM: { input, select, textarea } } = React
import TextArea from './textarea';
import TextBox from './textbox';
import moment from 'moment';
import DateTimeField from 'react-bootstrap-datetimepicker';
import axios from 'axios';
import {ROOT_URL} from '../../actions/index';

class EventForm extends Component {

    _handleImageChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            let currentState = {};
            currentState.file = file;
            currentState.imagePreviewUrl = reader.result;
            this.setState({currentState})
        }
        reader.readAsDataURL(file)
    }

    constructor (props) {
        super(props)
        this.state = {
            startDate: moment().format("YYYY-MM-DD HH:mm"),
            currentState :{}
        };
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange (date) {
        this.setState({
            startDate: moment.unix(date/1000).format("YYYY-MM-DD HH:mm")
        });
    }

    handleFormSubmit(data) {
        data.event_date = this.state.startDate;
        data.event_logo = this.state.currentState.file;
        this.callServer(data);
    }

    callServer(req_data) {

        let imageFormData = new FormData();

        imageFormData.append('data', JSON.stringify(req_data));
        let URL = ROOT_URL+'/events';

        const config = {
            headers: { 'Content-Type': 'application/json' },

        };

        var xhr = new XMLHttpRequest();
        xhr.open("POST", URL, true);
        xhr.onload = function () {
            if (this.status == 200) {
                console.log(this.response);
            } else {
                console.log(this.statusText);
            }
        };
        xhr.onerror = (err) => {console.log('error',err)};
        xhr.send(imageFormData);
    }

    render(){

        let {imagePreviewUrl} = this.state.currentState;

        let $imagePreview = null;
        if (imagePreviewUrl !== undefined && imagePreviewUrl !== '') {
            $imagePreview = (<img src={imagePreviewUrl} style={{height: 160}} alt="..."/>);
        }else{
            $imagePreview = (<img src="http://placehold.it/320x160" alt="..."/>);
        }

        const { handleSubmit, fields: { event_title, event_description, event_address, event_city }} = this.props;

        return (
            <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} role="form">

                <div className="row">
                    <div className="col-sm-2 post-save-changes">
                        <button type="submit" className="btn btn-green btn-lg btn-block btn-icon">
                            Add
                            <i className="entypo-check"></i>
                        </button>
                    </div>

                    <div className="col-sm-10">
                        <Field name="event_title" type="text" className="form-control input-lg" component={TextBox} placeholder="Event Title"/>
                    </div>
                </div>

                <br />

                <div className="row">
                    <div className="col-sm-12">
                        <Field name="event_description" type="text" className="form-control" component={TextArea} placeholder="Event Description"/>
                    </div>
                </div>

                <br />

                <div className="row">

                    <div className="col-sm-6">

                        <div className="panel panel-primary" data-collapsed="0">

                            <div className="panel-heading">
                                <div className="panel-title">
                                    Event Info
                                </div>

                                <div className="panel-options">
                                    <a href="#" data-rel="collapse"><i className="entypo-down-open"></i></a>
                                </div>
                            </div>

                            <div className="panel-body">

                                <div className="">
                                    <Field name="event_address" type="text" className="form-control" component={TextArea} placeholder="Address"/>
                                </div>
                                <br />

                                <div className="">
                                    <Field name="event_city" type="text" className="form-control" component={TextBox} placeholder="City"/>
                                </div>
                                <br />

                                <p>Event Date</p>
                                <div className="input-group">
                                    <DateTimeField name="selected_field"
                                                   onChange={this.handleChange}
                                    />
                                </div>

                            </div>

                        </div>

                    </div>


                    <div className="col-sm-6">

                        <div className="panel panel-primary" data-collapsed="0">

                            <div className="panel-heading">
                                <div className="panel-title">
                                    Featured Image
                                </div>

                                <div className="panel-options">
                                    <a href="#" data-rel="collapse"><i className="entypo-down-open"></i></a>
                                </div>
                            </div>

                            <div className="panel-body">

                                <div className="fileinput fileinput-new" data-provides="fileinput">
                                    <div className="fileinput-new thumbnail" data-trigger="fileinput">
                                        {$imagePreview}
                                    </div>
                                    <div className="fileinput-preview fileinput-exists thumbnail" ></div>
                                    <div>
									<span className="btn btn-white btn-file">
										<span className="fileinput-new">Select image</span>
										<span className="fileinput-exists">Change</span>
										<input type="file" onChange={this._handleImageChange.bind(this)}  name="..." accept="image/*"/>
									</span>
                                        <a href="#" className="btn btn-orange fileinput-exists" data-dismiss="fileinput">Remove</a>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </form>
        )
    }
}

EventForm = reduxForm({
    form: 'eventForm',
    fields: ['event_title', 'event_description','event_address', 'event_city']
})(EventForm)

export default EventForm;
