import './Loading.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';





class Loading extends Component {
    render() {

        return (
            <div className='loading-ontainer'>
                <div onClick={() => this.props.history.push('/home')} className="bubble"></div>
                <div className="shadow"></div>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Loading));
