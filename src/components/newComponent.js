import './newComponent.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';





class newComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {

        return (
            <div className=''></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(newComponent);
