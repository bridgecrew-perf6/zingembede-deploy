import "./BoxSlider.scss"
import React, { Component } from "react"
import { connect } from "react-redux"
import Slider from "react-slick"
import { withRouter } from "react-router-dom"

let settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
}

class BoxSlider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isMouseOver: false,
            encodeId: null,
            dataLessThan5: this.props.data && this.props.data.length < 5 ? true : false
        }
    }
    handleOnMouse = item => {
        let idItem = item ? item : null
        this.setState({
            encodeId: idItem.encodeId
        })
    }
    handleOnBlur = () => {
        this.setState({
            encodeId: null
        })
    }
    handleShowDetail = item => {
        this.props.history.push(`/detail-album/${item.encodeId}`)
    }

    render() {
        let { h3, data } = this.props
        let { dataLessThan5 } = this.state

        return (
            <div className="box-slider">
                <h3>{h3}</h3>
                {dataLessThan5 ? (
                    <div className="wrap-items-5">
                        {data &&
                            data.length > 0 &&
                            data.map((item, index) => {
                                return (
                                    <div
                                        onClick={() => this.handleShowDetail(item)}
                                        onMouseOver={() => this.handleOnMouse(item)}
                                        onMouseOut={() => this.handleOnBlur()}
                                        key={index}
                                        className="item-5"
                                    >
                                        <div className="wrap-img">
                                            <div className="layer-two">
                                                {this.state.encodeId === item.encodeId && (
                                                    <div className="overwritten-buttons">
                                                        <i
                                                            onClick={() => this.handleShowDetail(item)}
                                                            title="Play"
                                                            className="fa-regular fa-circle-play"
                                                        ></i>
                                                    </div>
                                                )}

                                                <img src={item.thumbnailM} alt="img-song" />
                                            </div>
                                        </div>
                                        <div className="desciption">
                                            <div className="title-song">{item.title}</div>
                                            <div className="artists">{item.artistsNames}</div>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                ) : this.props.detail ? (
                    <div className="wrap-items-5">
                        {data &&
                            data.length > 0 &&
                            data.map((item, index) => {
                                return (
                                    <div
                                        onClick={() => this.handleShowDetail(item)}
                                        onMouseOver={() => this.handleOnMouse(item)}
                                        onMouseOut={() => this.handleOnBlur()}
                                        key={index}
                                        className="item-5"
                                    >
                                        <div className="wrap-img">
                                            <div className="layer-two">
                                                {this.state.encodeId === item.encodeId && (
                                                    <div className="overwritten-buttons">

                                                        <i
                                                            onClick={() => this.handleShowDetail(item)}
                                                            title="Play"
                                                            className="fa-regular fa-circle-play"
                                                        ></i>

                                                    </div>
                                                )}

                                                <img src={item.thumbnailM} alt="img-song" />
                                            </div>
                                        </div>
                                        <div className="desciption">
                                            <div className="title-song">{item.title}</div>
                                            <div className="artists">{item.artistsNames}</div>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                ) : (
                    <div className="wrap-items">
                        <Slider {...settings}>
                            {data &&
                                data.length > 0 &&
                                data.map((item, index) => {
                                    return (
                                        <div
                                            onClick={() => this.handleShowDetail(item)}
                                            onMouseOver={() => this.handleOnMouse(item)}
                                            onMouseOut={() => this.handleOnBlur()}
                                            key={index}
                                            className="item"
                                        >
                                            <div className="wrap-img">
                                                <div className="layer-two">
                                                    {this.state.encodeId === item.encodeId && (
                                                        <div className="overwritten-buttons">

                                                            <i
                                                                onClick={() => this.handleShowDetail(item)}
                                                                title="Play"
                                                                className="fa-regular fa-circle-play"
                                                            ></i>

                                                        </div>
                                                    )}

                                                    <img src={item.thumbnailM} alt="img-song" />
                                                </div>
                                            </div>
                                            <div className="desciption">
                                                <div>{item.title}</div>
                                                <div className="artists">{item.artistsNames}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                        </Slider>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BoxSlider))
