import "./ModalDetailInfomation.scss"
import React, { Component } from "react"
import { connect } from "react-redux"
import { Scrollbars } from "react-custom-scrollbars"

class ModalDetailInfomation extends Component {
    render() {
        let { data } = this.props
       
        return (
            <div onClick={event => this.props.handleToggleModal(event, false)} className="modal-container">
                {data && (
                    <div onClick={event => this.props.handleToggleModal(event, true)} className="box-modal">
                        <div onClick={event => this.props.handleToggleModal(event, false)} className="close-btn">
                            <i className="fa-solid fa-circle-xmark"></i>
                        </div>
                        <div className="header">
                            <div className="wrap-img">
                                <img src={data.thumbnail} alt="avatar" />
                            </div>
                            <div className="info">
                                <div className="name">
                                    Tên thật: <b>{data.realname}</b>
                                </div>
                                <div className="birthday">
                                    Birthday: <b>{data.birthday}</b>
                                </div>
                                <div className="national">
                                    Quốc tịch: <b>{data.national}</b>
                                </div>
                            </div>
                        </div>
                        <div className="body-modal">
                            <Scrollbars style={{ width: "100%", height: "100%" }}>
                                <div className="content" dangerouslySetInnerHTML={{ __html: data.biography }}></div>
                            </Scrollbars>
                        </div>
                    </div>
                )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalDetailInfomation)
