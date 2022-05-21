import './Loading2.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BallTriangle } from "react-loader-spinner"





class Loading2 extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {

        return (
            <div className='loading2-container'>
                <BallTriangle
                    heigth="100"
                    width="100"
                    color="#964B8A"
                    ariaLabel="loading-indicator"
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(Loading2);
