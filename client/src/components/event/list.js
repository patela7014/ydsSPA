import React, {PropTypes, Component} from 'react'

import { fetchEvents, fetchSabhas } from '../../actions/'
import { connect } from 'react-redux'
import { Button, Popover, Tooltip, Modal, OverlayTrigger } from 'react-bootstrap';
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import { Redirect } from 'react-router-dom';
import customHistory from '../../index';
class List extends Component{

    constructor(props){
        super(props);
        this.state = {
            filtered : [],
            events : [],
            sabhas : [],
            showModal : false,
            selectedSabha : 3,
            selectedEvent : ''
        }
        this.onChange = this.onChange.bind(this);
        this.open = this.open.bind(this);
        this.row = this.row.bind(this);
        this.filterEvents = this.filterEvents.bind(this);
        this.close = this.close.bind(this);

    }

    static propTypes = {
        history: PropTypes.object
    }

    componentDidMount() {
        if(this.props.isAuthenticated){
            this.props.fetchEvents((events)=>{
                this.setState({events})
            });
        }else{
            this.props.history.push('/login')
        }
    }

    close() {
        this.setState({ showModal: false });
    }

    open(selectedEvent) {
        this.setState({selectedEvent})
        this.props.fetchSabhas((sabhas)=>{
            this.setState({sabhas})
        })
        this.setState({ showModal: true });
    }

    filterEvents(){
        let all_events = this.state.events;
        let currentDate, filtered;

        switch (this.props.selectedOption){
            case "up_coming":
                currentDate = new Date();
                filtered = all_events.filter((event)=>
                    +currentDate < +new Date(event.event_date)
                );

                break;
            case "completed":
                currentDate = new Date();
                filtered = all_events.filter((event)=>
                    +currentDate >= +new Date(event.event_date)
                );
                break;
            case "all":
                filtered = all_events;
                break;
            case "special":
                filtered = [];
                break;
        }
        return filtered;
    }

    row(eventRow){
        return(
            <tr key={eventRow.id} onClick={()=>{this.open(eventRow.id)}}>
                <td className="col-name">
                    <a href="#" className="col-name">{eventRow.title}</a>
                </td>
                <td className="col-subject">
                    <a href="#">
                        <span className="label label-warning">Sabha</span>
                         &nbsp;{eventRow.description}
                    </a>
                </td>
                <td className="col-options"></td>
                <td className="col-time">{eventRow.event_date}</td>
            </tr>
        )
    }

    onChange(value) {
        this.setState({selectedSabha: value})
    }

    fetchSabhaMembers(selectedSabha){
        let {selectedEvent} = this.state;
        customHistory.push(`/events/${selectedEvent}/sabha/${selectedSabha}/attendance`);
    }

    modalData(){
        const popover = (
            <Popover id="modal-popover" title="popover">
            </Popover>
        );
        const tooltip = (
            <Tooltip id="modal-tooltip">
            </Tooltip>
        );
        let {sabhas} = this.state;
        let initialValue = this.state.selectedSabha;
        let radioButtons = sabhas.map((sabha)=>{
            return(
                <RadioButton key={sabha.id} value={sabha.id.toString()}>
                    {sabha.title}
                </RadioButton>
            )
        })
        return (
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Sabha</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RadioGroup value={initialValue.toString()} onChange={ this.onChange }>
                        {radioButtons}
                    </RadioGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>Close</Button>
                    <Button onClick={() => this.fetchSabhaMembers(initialValue)}>Continue</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    render(){
        let class_obj = this;
        let filtered = this.filterEvents();

        let filteredData = filtered.map((event)=>{
            return class_obj.row(event)
        })
        return(
            <div className="mail-body">

                <div className="mail-header">
                    <h3 className="mail-title">
                        Events
                        <span className="count"> ({filtered.length})</span>
                    </h3>

                    <form method="get" role="form" className="mail-search">
                        <div className="input-group">
                            <input type="text" className="form-control" name="s" placeholder="Search for event..." />
                            <div className="input-group-addon">
                                <i className="entypo-search"></i>
                            </div>
                        </div>
                    </form>
                </div>

                <table className="table mail-table">
                    <thead>
                    </thead>
                    <tbody>
                    {filteredData}
                    {this.modalData()}
                    </tbody>
                    <tfoot>
                    </tfoot>
                </table>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        events: state.data.events,
        sabhas : state.data.sabhas,
        isAuthenticated : state.auth.authenticated
    }
};

export default connect(mapStateToProps, { fetchEvents, fetchSabhas })(List)
