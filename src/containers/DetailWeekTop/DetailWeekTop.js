import "./DetailWeekTop.scss"
import React, { Component } from "react"
import { connect } from "react-redux"
import { Scrollbars } from "react-custom-scrollbars"
import { withRouter } from "react-router-dom"
import * as actions from '../../store/actions'
import PlayListWihoutCD from "../PlayListWithoutCD/PlayListWithoutCD"
import PlayerMusic2 from "../BoxPlayMusic/PlayerMusic2"


class DetailWeekTop extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataWeekTop: null,
            dataWeekTopVn: null,
            dataWeekTopUsuk: null,
            dataWeekTopKorea: null,
            currentCountry: this.props.match.params.country,
            playMusic: false,
            idSong: null,
            customPlayMode: false,
            isLoading: false,
            avatarSong: null,
            nameSong: null,
            artist: null,
            duration: null,
        }
    }
    componentDidMount() {
        const itemCountry = document.querySelectorAll(".item-country")
        if (itemCountry) {
            if (this.state.currentCountry === "vn") {
                this.handleLineSmooth({ target: itemCountry[0] }, this.state.currentCountry)
            } else if (this.state.currentCountry === "us") {
                this.handleLineSmooth({ target: itemCountry[1] }, this.state.currentCountry)
            } else {
                this.handleLineSmooth({ target: itemCountry[2] }, this.state.currentCountry)
            }
        }
        if (this.props.dataWeekTop.err === 0) {
            this.setState({
                dataWeekTop: Object.values(this.props.dataWeekTop.data.weekChart),
                dataWeekTopVn: Object.values(this.props.dataWeekTop.data.weekChart)[0].items,
                dataWeekTopUsuk: Object.values(this.props.dataWeekTop.data.weekChart)[1].items,
                dataWeekTopKorea: Object.values(this.props.dataWeekTop.data.weekChart)[2].items
            })
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.refreshPlayState !== this.props.refreshPlayState) {
            if (this.props.refreshPlayState === '4') {
                this.setState({
                    playMusic: true
                })
            } else {
                this.setState({
                    playMusic: false,
                    idSong: null
                })
            }
        }
    }

    handleLineSmooth = (event, id) => {
        let rectItem = event.target.getBoundingClientRect()
        let rectItemVN = document.querySelector('.vn').getBoundingClientRect()
        const lineEl = document.querySelector(".line")
        lineEl.style.left = `${rectItem.left - rectItemVN.left}px`
        lineEl.style.width = `${rectItem.width}px`
        this.setState({
            currentCountry: id
        })
    }
    getCurrentSong = id => {
        this.setState({
            idSong: id
        })
    }
    handleCustomPlay = playlistSong => {
        if (playlistSong) {
            let randomIndexSong = (Math.random() * playlistSong.length - 1).toFixed(0)
            this.setState({
                idSong: playlistSong[randomIndexSong].encodeId,
                playMusic: true,
                customPlayMode: true,
                avatarSong: playlistSong[randomIndexSong].thumbnail,
                nameSong: playlistSong[randomIndexSong].title,
                artist: playlistSong[randomIndexSong].artistsNames,
                duration: playlistSong[randomIndexSong].duration,
            })
        }
    }
    handlePlayMusic = item => {
        this.props.refreshPlay('4')
        this.setState({
            idSong: item.encodeId,
            playMusic: true,
            artist: item.artistsNames,
            nameSong: item.title,
            avatarSong: item.thumbnail,
            duration: item.duration,
        })
    }

    render() {
        let playlist =
            this.state.currentCountry === "vn"
                ? this.state.dataWeekTopVn
                : this.state.currentCountry === "us"
                    ? this.state.dataWeekTopUsuk
                    : this.state.dataWeekTopKorea
        return (
            <>
                <div className="detail-week-top-container">
                    <div className="bg-5"></div>
                    <div className="bg-gradient"></div>
                    <div className="contents">
                        <div className="title-week-top">Bảng Xếp Hạng Tuần</div>
                        <div className="country">
                            <div onClick={event => this.handleLineSmooth(event, "vn")} className="item-country vn">
                                Việt Nam
                            </div>
                            <div onClick={event => this.handleLineSmooth(event, "us")} className="item-country">
                                {" "}
                                US-UK{" "}
                            </div>
                            <div onClick={event => this.handleLineSmooth(event, "korea")} className="item-country">
                                K-POP
                            </div>
                            <div className="line"></div>
                        </div>
                        <div className="play-list">
                            <Scrollbars style={{ width: "100%", height: "60vh" }}>
                                {playlist && (
                                    <PlayListWihoutCD
                                        playlist={playlist}
                                        idSong={this.state.idSong}
                                        handlePlayMusic={this.handlePlayMusic}
                                        rank={true}
                                    />
                                )}
                            </Scrollbars>
                        </div>
                    </div>
                </div>
                {this.state.playMusic && (
                    <PlayerMusic2
                        idSong={this.state.idSong}
                        type={4}
                        album={playlist}
                        getCurrentSong={this.getCurrentSong}
                        handleCustomPlay={this.handleCustomPlay}
                        customPlayMode={this.state.customPlayMode}
                        avatarSong={this.state.avatarSong}
                        nameSong={this.state.nameSong}
                        artist={this.state.artist}
                        duration={this.state.duration}
                    />
                )}
            </>
        )
    }
}
const mapStateToProps = state => {
    return {
        dataWeekTop: state.dataChartHome,
        refreshPlayState: state.refreshPlay
    }
}

const mapDispatchToProps = dispatch => {
    return {
        refreshPlay: (id) => dispatch(actions.refreshPlay(id))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailWeekTop))
