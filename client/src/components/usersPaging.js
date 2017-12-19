import React from 'react';

class UsersPaging extends React.Component{

    renderFirstPage(){
        const {handleClick,currentPage } = this.props;
        return (
            <span>
                <a onClick={handleClick} id="1"  className={parseInt(currentPage,10) === 1 ? 'paginate_button current' : 'paginate_button '} key="1" aria-controls="table-2" data-dt-idx="1" tabIndex="0">1</a>
            </span>
        )

    }

    renderLastPage(){
        const {handleClick,currentPage } = this.props;
        let lastPage = this.props.pageNumbers.length;
        return (
            <span>
                {(lastPage - parseInt(currentPage,10) > 2) ? <span className="ellipsis">…</span> : ''}

                <a onClick={handleClick} id={lastPage}  className={parseInt(currentPage,10) === parseInt(lastPage,10) ? 'paginate_button current' : 'paginate_button '} key={lastPage} aria-controls="table-2" data-dt-idx={lastPage} tabIndex="0">{lastPage}</a>
            </span>
        )
    }

    renderPreviousNextWithDot(currentPage){
        let lastPage = this.props.pageNumbers.length;
        return (
            <span>
                <span className="ellipsis">…</span>
                {this.renderPage(currentPage, parseInt(currentPage,10)-1)}
                {this.renderPage(currentPage, currentPage)}
                {/*{(lastPage - parseInt(currentPage,10) > 1) ? this.renderPage(currentPage, currentPage) : ''}*/}
                {(lastPage - parseInt(currentPage,10) > 1) ? this.renderPage(currentPage, parseInt(currentPage,10)+1) : ''}
            </span>
        )
    }

    renderPage(currentPage, number) {
        return (
            <a onClick={this.props.handleClick} id={number} className={
                parseInt(currentPage,10) === parseInt(number,10)
                    ? 'paginate_button current'
                    : 'paginate_button '} key={number} aria-controls="table-2" data-dt-idx={number} tabIndex="0">{number}</a>
        )
    }

    renderMiddlePages(){
        const {currentPage,pageNumbers} = this.props;
        let lastPage = this.props.pageNumbers.length;

        if(currentPage >= 5 ){
            return this.renderPreviousNextWithDot(currentPage);
        }else{
            return pageNumbers.map(number => {

                if(parseInt(number,10) > 1 && parseInt(number,10) < lastPage){
                    if(number < 6){
                        return this.renderPage(currentPage, number);
                    }
                }
                return '';
            });
        }

    }

    renderPages(){
        const {currentPage} = this.props;
        let lastPage = this.props.pageNumbers.length;

        return (
            <span>
                {this.renderFirstPage()}
                {this.renderMiddlePages()}
                {(parseInt(currentPage,10) !== lastPage) ? this.renderLastPage() : ''}
            </span>
        )
    }

    render(){
        const {handleClick,currentPage} = this.props;
        let lastPage = this.props.pageNumbers.length;
        return(
            <div className="dataTables_paginate paging_simple_numbers" id="table-2_paginate">
                <a className={parseInt(currentPage,10) === 1 ? "paginate_button previous  disabled" : "paginate_button previous"} aria-controls="table-2" data-dt-idx="0" tabIndex="0" key="previous" onClick={handleClick} id={parseInt(currentPage,10) - 1} >Previous</a>
                {this.renderPages()}

                <a className={parseInt(currentPage,10) === parseInt(lastPage,10) ? "paginate_button next  disabled" : "paginate_button next"} aria-controls="table-2" data-dt-idx="7" key="next" tabIndex="0" onClick={(parseInt(currentPage,10) !== lastPage) ? handleClick : ''} id={parseInt(currentPage,10) +1} >Next</a>
            </div>
        )
    }
}

export default UsersPaging;