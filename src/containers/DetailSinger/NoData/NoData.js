import "./NoData.scss"
import React, { Component } from "react"
import { connect } from "react-redux"

class Activity extends Component {
    render() {
        return <div className="nodata-container">Chưa có data</div>
    }
}
const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = dispatch => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Activity)
