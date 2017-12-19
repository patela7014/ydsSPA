import React, {PropTypes, Component} from 'react'

import { Field, reduxForm } from 'redux-form'
const  { DOM: { input, select, textarea } } = React
import {Link} from 'react-router-dom';

class EventSideBar extends Component {

    constructor (props) {
        super(props)
        // this.state = {
        //     selectedOption: 'up_coming'
        // };
    }
    updateSelected(option){
        this.props.updateSelectedOption(option);
    }
    render(){
        const {type, name, placeholder, className, touched, error} = this.props;
        return (
            <div className="mail-sidebar">

                <div className="mail-sidebar-row hidden-xs">
                        <Link className="btn btn-success btn-icon btn-block" to={"/events/add"}>
                            Create Event<i className="entypo-pencil"></i>
                        </Link>
                </div>

                <ul className="mail-menu">
                    <li className={ (this.props.selectedOption == 'up_coming') ?"active" : ''}>
                        <a href="#" onClick={()=>this.updateSelected('up_coming')}>
                            {/*<span className="badge badge-danger pull-right">6</span>*/}
                            Up Coming
                        </a>
                    </li>
                    <li className={ (this.props.selectedOption == 'completed') ?"active" : ''}>
                        <a href="#" onClick={()=>this.updateSelected('completed')}>
                            {/*<span className="badge badge-gray pull-right">1</span>*/}
                            Completed
                        </a>
                    </li>
                    <li className={ (this.props.selectedOption == 'all') ?"active" : ''}>
                        <a href="#" onClick={()=>this.updateSelected('all')}>
                            All Events
                        </a>
                    </li>
                    <li className={ (this.props.selectedOption == 'special') ?"active" : ''}>
                        <a href="#" onClick={()=>this.updateSelected('special')}>
                            Special Events
                        </a>
                    </li>
                </ul>

                <div className="mail-distancer"></div>



            </div>

        )
    }
}
export default EventSideBar;
