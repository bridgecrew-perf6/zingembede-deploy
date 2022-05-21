import "./SingleAndEp.scss"
import React, { Component } from "react"
import { connect } from "react-redux"
import BoxSlider from "../../BoxSlider/BoxSlider"

class SingleAndEp extends Component {
    render() {
        let { singleAndEpFull } = this.props
        return (
            <div className="single-and-ep">
                <div className="content">
                    <BoxSlider h3={""} data={singleAndEpFull} detail={true} />
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = dispatch => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleAndEp)
