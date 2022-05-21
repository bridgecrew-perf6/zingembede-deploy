import './IsAuthencated.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';





class IsAuthencated extends Component {
    render() {
        
        return (
            <>
            
            </>
        )
    }
}
const mapStateToProps = state => {
    return {
        isLoggedIn: state.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IsAuthencated));
