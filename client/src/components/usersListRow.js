import React from 'react';
import {Link} from 'react-router-dom';
class UsersListRow extends React.Component{

    rowData(user){
        return (
            <tr key={user.id}>
                <td>
                    <div className="member-entry">

                        <a href={"/user/"+user.family_id+"/"+user.u_id} className="member-img">
                            {user.profile_picture ?
                                (
                                    <img src={"/public/uploads/"+user.profile_picture} className="img-rounded"  alt="..."/>
                                ) :
                                (
                                    <img src="/public/uploads/yds.jpg" className="img-rounded"  alt="..."/>
                                )
                            }

                            <i className="entypo-forward"></i>
                        </a>

                        <div className="member-details">
                            <h4>
                                <Link to={"/user/"+user.family_id+"/"+user.u_id}>{user.first_name} {user.last_name}</Link>
                            </h4>

                            <div className="row info-list">

                                <div className="col-sm-4">
                                    <i className="entypo-briefcase"></i> Designation : {user.designation}
                                </div>

                                <div className="col-sm-4">
                                    <i className="entypo-mail"></i> Email : {user.email}
                                </div>

                                <div className="col-sm-4">
                                    <i className="entypo-phone"></i> Phone : {user.cell_phone}
                                </div>

                                <div className="clear"></div>

                                <div className="col-sm-4">
                                    <i className="entypo-back-in-time"></i> Birth Date : {user.month_name} {user.birth_day}
                                </div>

                                <div className="col-sm-4">
                                    <i className="entypo-location"></i> Location : {user.city}
                                </div>

                            </div>
                        </div>

                    </div>
                </td>
            </tr>
        )
    }


    render(){

        const {filteredRows} = this.props;
        let usersList = "";
        usersList = filteredRows.map(function (user) {
            return (
                this.rowData(user)
            )
        }.bind(this));

        return(
            <tbody>
                {usersList}
            </tbody>
        )
    }
}

export default UsersListRow;