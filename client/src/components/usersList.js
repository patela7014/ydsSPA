import React from 'react';
import UsersListTable from './usersListTable';
import UsersPaging from './usersPaging';

class UsersList extends React.Component{

    constructor(){
        super();
        this.state = {
            matchedIndexes: [],
            matchedObjects: [],
            currentPage: 1,
            usersPerPage: 5,
            pageData : {}
        }
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount(){
    }

    handleClick(event) {
        let selectedPage = Number(event.target.id);
        if(selectedPage > 0) {
            this.setState({
                currentPage: selectedPage
            });
        }
    }
    getObjectAt(index) {
        return this.props.users[index];
    }

    filterRows(e) {
        let filteredIndexes = [];
        let filteredObj = [];
        let size = this.props.users.length;
        let filterBy = e.target.value.toLowerCase();
        for (let index = 0; index < size; index++) {
            let {first_name, last_name} = this.getObjectAt(index);
            if(first_name !== null){
                if(first_name.toLowerCase().indexOf(filterBy) !== -1 && filteredIndexes.indexOf(index) === -1){
                    filteredIndexes.push(index);
                    filteredObj.push(this.props.users[index]);
                }
            }
            if(last_name !== null){
                if(last_name.toLowerCase().indexOf(filterBy) !== -1 && filteredIndexes.indexOf(index) === -1){
                    filteredIndexes.push(index);
                    filteredObj.push(this.props.users[index]);
                }
            }
        }
        this.setState({
            'matchedIndexes':filteredObj,
            currentPage: 1
        })
    }

    handlePageSizeChange(e) {
        this.setState({
            usersPerPage: Number(e.target.value),
            currentPage: 1
        })
    }

    renderPage(currentPage, number) {
        return (
            <a onClick={this.handleClick} id={number} className={
                parseInt(currentPage,10) === parseInt(number,10)
                    ? 'paginate_button current'
                    : 'paginate_button '} key={number} aria-controls="table-2" data-dt-idx={number} tabIndex="0">{number}</a>
        )
    }

    render(){
        let {users} = this.props;
        if(users.hasOwnProperty('all_users')){
            users = users.all_users;
        }
        const { currentPage, usersPerPage, matchedIndexes } = this.state;

        // Logic for displaying users
        const indexOfLastUser = currentPage * usersPerPage;
        const indexOfFirstUser = indexOfLastUser - usersPerPage;
        const usersListOnLoad = matchedIndexes.length ? matchedIndexes : users;

        const currentUsers = usersListOnLoad.slice(indexOfFirstUser, indexOfLastUser);

        const renderUsers = currentUsers.map((user, index) => {
            return user;
        });

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(usersListOnLoad.length / usersPerPage); i++) {
            pageNumbers.push(i);
        }

        let totalUsers = users.length;

        return(
            <div id="table-2_wrapper" style={{margin: 15}} className="dataTables_wrapper no-footer">
                <div className="col-xs-6 dataTables_length" id="table-2_length">
                    <label>Show &nbsp;
                        <select name="table-2_length" aria-controls="table-2" className=""  value={this.props.pageSize} onChange={this.handlePageSizeChange.bind(this)}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="-1">All</option>
                        </select> entries
                    </label>
                </div>
                <div id="table-2_filter" className="col-xs-6 dataTables_filter">
                    <label className="pull-right ">Search : &nbsp;
                        <input type="search"
                                ref="searchInput" onLoadStart={()=>{this.filterRows(event)}} onChange={this.filterRows.bind(this)}  className="" placeholder="" aria-controls="table-2"/>
                    </label>
                </div>

                <UsersListTable {...this.props} filteredRows={renderUsers}/>
                <div className="dataTables_info" id="table-2_info" role="status" aria-live="polite">Showing {indexOfFirstUser+1} to {indexOfLastUser} of {totalUsers} entries</div>
                <UsersPaging {...this.props} currentPage={currentPage} pageNumbers={pageNumbers} handleClick={this.handleClick}/>
            </div>
        )
    }
}

export default UsersList;
