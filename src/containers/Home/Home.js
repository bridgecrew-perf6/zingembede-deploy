import "./home.scss"
import React, { Component } from "react"
import { connect } from "react-redux"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"
import * as actions from "../../store/actions"
import { withRouter } from "react-router-dom"



// import { withRouter } from 'react-router';

//components
import PlayerMusic2 from "../BoxPlayMusic/PlayerMusic2"
import BoxSlider from "../BoxSlider/BoxSlider"
import ChartSection from "../Chart/Chart"
import Loading2 from '../Loading2/Loading2'

//settings slider
let settingsTopSlider = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false
}
let settingsSingersSlider = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false
}

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataHome: null,
            contentHome: null,
            banner: null,
            isShowPlayerMusic: false,
            idCurrentSong: null,
            contentHome2: null,
            contentHome3: null,
            dataChartHome: null,
            dataWeekTop: null,
            selectedCountry: null,
            loading: true,
            avatarSong: null,
            nameSong: null,
            artist: null,
            duration: null,
        }
    }
    async componentDidMount() {
        await Promise.all([this.props.getHomepage("1"), this.props.getHomepage("2"), this.props.getHomepage("3"), this.props.getChartHome()])
    }
    componentDidUpdate(prevProps) {
        if (prevProps.dataHomePage !== this.props.dataHomePage && this.props.dataHomePage.err === 0) {
            this.setState({
                dataHome: this.props.dataHomePage.data,
                contentHome: this.props.dataHomePage.data.items
            })
        }
        if (prevProps.dataHomePage2 !== this.props.dataHomePage2 && this.props.dataHomePage2.err === 0) {
            this.setState({
                dataHome: this.props.dataHomePage2.data,
                contentHome2: this.props.dataHomePage2.data.items[1]
            })
        }
        if (prevProps.dataHomePage3 !== this.props.dataHomePage3 && this.props.dataHomePage3.err === 0) {
            this.setState({
                dataHome: this.props.dataHomePage3.data,
                contentHome3: this.props.dataHomePage3.data.items,
                loading: false
            })
        }
        if (prevProps.dataChartHome !== this.props.dataChartHome && this.props.dataChartHome.err === 0) {
            this.setState({
                dataChartHome: this.props.dataChartHome.data,
                dataWeekTop: Object.values(this.props.dataChartHome.data.weekChart)
            })
        }
        if (prevProps.refreshPlayState !== this.props.refreshPlayState) {
            if (this.props.refreshPlayState === '5') {
                this.setState({
                    isShowPlayerMusic: true
                })
            } else {
                this.setState({
                    isShowPlayerMusic: false,
                    idSong: null
                })
            }
        }
    }

    getDataForEachSection = () => {
        let banner = null
        let suggest = null
        let selectToday = null
        let xone = null
        let { contentHome, contentHome3 } = this.state
        if (contentHome && contentHome.length > 0) {
            contentHome.forEach(item => {
                switch (item.sectionId) {
                    case "hSlider":
                        banner = { data: item.items }
                        break
                    case "hSuggestPl":
                        suggest = { data: item.items, title: item.title }
                        break
                    case "hAutoTheme1":
                        selectToday = { data: item.items, title: item.title }
                        break
                    case "hXone":
                        xone = { data: item.items, title: item.title }
                        break
                    default:
                        break
                }
            })
        }
        let dataChart = null
        let singers = null
        let top100 = null
        if (contentHome3 && contentHome3.length > 0) {
            contentHome3.forEach(item => {
                switch (item.sectionId) {
                    case "hZC":
                        dataChart = { data: item.chart, topSongs: item.items }
                        break
                    case "":
                        singers = item.items
                        break
                    case "h100":
                        top100 = { data: item.items, title: item.title }
                        break
                    default:
                        break
                }
            })
        }
        return { banner, suggest, selectToday, xone, dataChart, singers, top100 }
    }
    handleDetail = item => {
        if (item.type === 1) {
            this.props.refreshPlay('5')
            this.setState({
                isShowPlayerMusic: true,
                idCurrentSong: item.encodeId,
                type: item.type,
                artist: item.artistsNames,
                nameSong: item.title,
                avatarSong: item.thumbnail,
                duration: item.duration,
            })
        }
        if (item.type === 4) {
            this.props.history.push(`/detail-album/${item.encodeId}`)
        }
        if (item.type === 8) {
            alert("link tới xem live!")
        }
        if (!item.type) {
            this.props.history.push(`/detail-singer/${item.alias}`)
        }
    }
    handleToDetailWeekTop = item => {
        this.setState(
            {
                selectedCountry: item.country
            },
            () => this.props.history.push(`/detail-week-top/${this.state.selectedCountry}`)
        )
    }
    handleFormatNumber = number => {
        let quotientNumber = NaN
        while (number > 1000) {
            quotientNumber = quotientNumber
                ? `${quotientNumber}${Math.floor(number / 1000)}`
                : `${Math.floor(number / 1000)}`
            number = number % 1000
        }
        return `${quotientNumber}.${(number / 100).toFixed(0)}K`
    }

    render() {
        let { contentHome2 } = this.state
        let editedData = this.getDataForEachSection()
        let banner = editedData ? editedData.banner : {}
        let suggest = editedData ? editedData.suggest : {}
        let selectToday = editedData ? editedData.selectToday : {}
        let xone = editedData ? editedData.xone : {}
        let { idCurrentSong } = this.state
        let idSong = idCurrentSong ? idCurrentSong : null
        let dataChart = editedData.dataChart
        let singers = editedData.singers
        let top100 = editedData.top100


        return (
            <>
                <div className="wrapper-home">
                    <div className="home-container">
                        <div className="under-search"></div>
                        <div className="slider section">
                            <Slider {...settingsTopSlider} className="slider-banner">
                                {banner &&
                                    banner.data.length > 0 &&
                                    banner.data.map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                onClick={() => this.handleDetail(item)}
                                                className="item-banner"
                                            >
                                                <div className="padding-box">
                                                    <img src={item.banner} alt="banner" />
                                                </div>
                                            </div>
                                        )
                                    })}
                            </Slider>
                        </div>
                        {suggest && <BoxSlider h3={suggest.title} data={suggest.data} />}
                        {selectToday && <BoxSlider h3={selectToday.title} data={selectToday.data} />}
                        {xone && <BoxSlider h3={xone.title} data={xone.data} />}
                        {contentHome2 && contentHome2.items && (
                            <BoxSlider h3={contentHome2.title} data={contentHome2.items} />
                        )}
                        {dataChart && <ChartSection data={dataChart} home={true} />}
                        <div className="week-top-section section">
                            {this.state.dataWeekTop &&
                                this.state.dataWeekTop.length > 0 &&
                                this.state.dataWeekTop.map((item, index) => {
                                    return (
                                        <div
                                            onClick={() => this.handleToDetailWeekTop(item)}
                                            key={index}
                                            className="wrap-img"
                                        >
                                            <div className="item-week-top">
                                                <img src={item.banner} alt="" />
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>
                        <div className="slider-singer">
                            <Slider {...settingsSingersSlider} className="slider-singers">
                                {singers &&
                                    singers.length > 0 &&
                                    singers.map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                onClick={() => this.handleDetail(item)}
                                                className="item-singers"
                                            >
                                                <div className="padding-box">
                                                    <img src={item.thumbnail} alt="singers" />
                                                </div>
                                                <small className="name-singer">{item.name}</small>
                                                <small className="total-follow">
                                                    <i className="fa-solid fa-heart"></i>
                                                    {this.handleFormatNumber(item.totalFollow)}
                                                </small>
                                            </div>
                                        )
                                    })}
                            </Slider>
                        </div>
                        <div className="top-100 section">{top100 && <BoxSlider h3={""} data={top100.data} />}</div>
                    </div>
                </div>
                {this.state.isShowPlayerMusic && <PlayerMusic2
                    type={this.state.type}
                    idSong={idSong}
                    artist={this.state.artist}
                    duration={this.state.duration}
                    avatarSong={this.state.avatarSong}
                    nameSong={this.state.nameSong}
                />}
                {this.state.loading && <Loading2 />}

            </>
        )
    }
}
const mapStateToProps = state => {
    return {
        dataHomePage: state.dataHomePage,
        dataHomePage2: state.dataHomePage2,
        dataHomePage3: state.dataHomePage3,
        dataChartHome: state.dataChartHome,
        refreshPlayState: state.refreshPlay
        // isLoggedIn: state.isLoggedIn
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getHomepage: page => dispatch(actions.getHomepage(page)),
        getChartHome: () => dispatch(actions.getChartHome()),
        login: (status) => dispatch(actions.login(status)),
        getPersonal: (idUser) => dispatch(actions.getPersonal(idUser)),
        refreshPlay: (id) => dispatch(actions.refreshPlay(id)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home))
