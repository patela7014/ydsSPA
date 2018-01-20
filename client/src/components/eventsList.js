import React, {PropTypes, Component} from 'react'
import { connect } from 'react-redux'
import { fetchUsers } from '../actions/'
import UsersList from '../components/usersList';
import EventSideBar from '../components/event/sidebar';
import List from '../components/event/list';
import {Link} from 'react-router-dom';

class EventsList extends Component {

    constructor (props) {
        super(props)
        this.state = {
            selectedOption: 'up_coming'
        };
        this.updateSelectedOption = this.updateSelectedOption.bind(this)
    }
    static propTypes = {
        history: PropTypes.object.isRequired
    }

    componentDidMount() {
        if(!this.props.isAuthenticated){
            this.props.history.push('/login')
        }
    }

    componentDidUpdate() {
    }

    updateSelectedOption(option){
        this.setState({selectedOption : option})
    }

    render() {
        const { users } = this.props;
        return (
            <div className="main-content">
                <div className="mail-env">
                    <div className="mail-sidebar-row visible-xs">
                        <Link className="btn btn-success btn-icon btn-block" to={"/events/add"}>
                            Create Event<i className="entypo-pencil"></i>
                        </Link>
                    </div>
                    <List {...this.state}/>
                    <EventSideBar {...this.state} updateSelectedOption={this.updateSelectedOption} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        users: state.data.users,
        isAuthenticated : state.auth.authenticated
    }
};


EventsList.propTypes = {
    fetchUsers: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, { fetchUsers })(EventsList)