import {Link} from 'react-router-dom';
import React, {PropTypes, Component} from 'react'

import { connect } from 'react-redux';
import DualListBox from 'react-dual-listbox';
import { fetchSabhaUsers, saveEventAttendance } from '../actions/'
class Attendance extends Component{

    constructor(props){
        super(props);
        this.state = {
            selected : [],
            users : []
        }
    }

    static propTypes = {
        history: PropTypes.object.isRequired
    }


    componentDidMount() {
        if(this.props.isAuthenticated){
            const {event_id, sabha_id} = this.props.match.params;
            this.props.fetchSabhaUsers(event_id, sabha_id, (data)=>{
                const attended = data.attended.map((record)=> record.user_id);
                this.setState({selected : attended});
                this.setState({users : data.all_users});

            });
        }else{
            this.props.history.push('/login')
        }
    }

    update_selected(selected){
        this.setState({selected});
    }

    renderUsers(){
        const { users } = this.state;
        let userOptions = [];
        users.map((user)=>{
            userOptions.push({
                value: `${user.user_id}`, label: `${user.first_name} ${user.last_name}`
            })
        })
        return (
            userOptions
        )
    }

    submitAttendance(){
        let present = this.state.selected;
        const {event_id} = this.props.match.params;
        let absentUsers = this.getExcludedUsers();
        let absent = absentUsers.map((record)=> record.user_id);
        this.props.saveEventAttendance(event_id, present, absent)
    }

    getExcludedUsers(){

        let {selected} = this.state;
        let {users} = this.props;
        return users.filter((user) => {
            return selected.indexOf(user.user_id.toString()) == -1;
        })
    }
    render(){
        const {selected} = this.state;
        return(
            <div id="table-2_wrapper" style={{margin: 15, height:500}} className="dataTables_wrapper no-footer">
                <DualListBox
                    options={this.renderUsers()}
                    selected={selected}
                    onChange={(selected) => {
                        this.update_selected(selected);
                    }}
                />

                <div className="row">
                    <div className="col-sm-2 post-save-changes">
                        <button onClick={this.submitAttendance.bind(this)} type="button" className="btn btn-green btn-lg btn-block btn-icon">
                            Save
                            <i className="entypo-check"></i>
                        </button>
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return{
        users: state.data.users.all_users,
        attended : state.data.users.attended,
        isAuthenticated : state.auth.authenticated
    }
};

export default connect(mapStateToProps, { fetchSabhaUsers, saveEventAttendance })(Attendance);
