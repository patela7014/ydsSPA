import React from 'react';
import UsersListRow from './usersListRow';


class UsersListTable extends React.Component{

    render(){

        return(
            <table className="table table-bordered table-striped datatable" id="table-2">
                <thead>
                <tr hidden>
                    <th></th>
                </tr>
                </thead>

                <UsersListRow {...this.props}/>
            </table>

        )
    }
}

export default UsersListTable;