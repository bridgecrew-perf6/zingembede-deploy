import React from "react";
import { connect } from "react-redux";

import { getSongByIdService } from '../servives/userService'


class TestApi extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    // async componentDidMount() {
    //     let response = await getSongByIdService()
    //     console.log(response);
    // }

    render() {
        return (
            <div className="">
                test api
                dasdasdasd
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggin: state.isLoggedin
    }
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TestApi)