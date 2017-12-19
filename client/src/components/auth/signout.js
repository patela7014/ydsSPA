import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class Signout extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired
    }
  componentWillMount() {
    this.props.signoutUser();
  }

  componentDidUpdate(){
      if(!this.props.isAuthenticated){
          this.props.history.push('/login')
      }
  }

  render() {
    return <div>Sorry to see you go...</div>;
  }
}

const mapStateToProps = (state) => {
    return{
        isAuthenticated : state.auth.authenticated
    }
};

export default connect(mapStateToProps, actions)(Signout);
