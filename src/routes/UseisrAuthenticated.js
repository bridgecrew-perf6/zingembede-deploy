import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom'





class UseisrAuthenticated extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: localStorage.getItem('user')
        }
    }
    render() {
        let linkRedirect = this.state.isLoggedIn ? '/home' : '/login'
        return (
            <Redirect to={linkRedirect} />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UseisrAuthenticated));
