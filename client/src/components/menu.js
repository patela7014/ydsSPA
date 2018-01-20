import {Link} from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';

class Menu extends React.Component{

    render(){
        // if(!this.props.isAuthenticated){
        //     return (
        //         <div></div>
        //     )
        // }
        return(
            <div className="sidebar-menu" style={{display: this.props.isAuthenticated ? '' : 'none' }}>

                <div className="sidebar-menu-inner">

                    <header className="logo-env">

                        <div className="logo">
                            <a href="/users">
                                <img src="/public/images/yds/yds_img.jpg" width="80" height="65" alt="" />
                            </a>
                        </div>

                        <div className="sidebar-collapse">
                            <a href="#" className="sidebar-collapse-icon">
                                <i className="entypo-menu"></i>
                            </a>
                        </div>
                        <div className="sidebar-mobile-menu visible-xs">
                            <a href="#" className="with-animation">
                                <i className="entypo-menu"></i>
                            </a>
                        </div>

                    </header>


                    <ul id="main-menu" className="main-menu">
                        <li>
                            <Link to={"/"}>
                                <i className="fa fa-users" aria-hidden="true"></i>
                                <span className="title">Muktos</span>
                            </Link>
                            {/*<a href="/users/add">*/}
                                {/*<i className="glyphicon glyphicon-plus"></i>*/}
                                {/*<span className="title"> Add New Mukt</span>*/}
                            {/*</a>*/}
                            <Link to={"/events"}>
                                <i className="fa fa-calendar" aria-hidden="true"></i>
                                <span className="title">Events</span>
                            </Link>
                            <Link to={"/events/add"}>
                                <i className="glyphicon glyphicon-plus" aria-hidden="true"></i>
                                <span className="title">Add Event</span>
                            </Link>
                            <Link to={"/logout"}>
                                <i className="glyphicon glyphicon-log-out" aria-hidden="true"></i>
                                <span className="title">Logout</span>
                            </Link>

                        </li>
                    </ul>

                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return{
        isAuthenticated : state.auth.authenticated
    }
};


export default connect(mapStateToProps, null)(Menu);
