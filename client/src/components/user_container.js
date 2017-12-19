import React, {PropTypes, Component} from 'react'
import { connect } from 'react-redux'
import { fetchUsers } from '../actions/'
import UsersList from '../components/usersList';
import Menu from '../components/menu';

class User_Container extends Component {

    static propTypes = {
        history: PropTypes.object.isRequired
    }


    componentDidMount() {
        if(this.props.isAuthenticated){
            this.props.fetchUsers();
        }else{
            this.props.history.push('/login')
        }
    }

    componentDidUpdate() {
    }

    render() {
        const { users } = this.props;
        return (
            <UsersList users={users}/>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        users: state.data.users,
        isAuthenticated : state.auth.authenticated
    }
};


User_Container.propTypes = {
    fetchUsers: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, { fetchUsers })(User_Container)