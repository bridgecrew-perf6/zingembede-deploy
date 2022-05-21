import "./DetailSearch.scss"
import React, { Component } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import { getSearch } from "../../services/userService"
import PlayListWithoutCD from "../PlayListWithoutCD/PlayListWithoutCD"
import BoxSlider from "../BoxSlider/BoxSlider"
import PlayerMusic2 from "../BoxPlayMusic/PlayerMusic2"
import * as actions from '../../store/actions'
import Loading2 from "../Loading2/Loading2"

class DetailSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSearch: null,
            idSong: null,
            playMusic: false,
            customPlayMode: false,
            type: null,
            isLoading: false
        }
    }
    async componentDidMount() {
        this.setState({ isLoading: true })
        let response = await getSearch(this.props.match.params.keyword)
        if (response) this.setState({ isLoading: false })
        if (response && response.data.err === 0) {
            this.setState({
                dataSearch: response.data.data
            })
        }
    }
    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.match.params.keyword !== this.props.match.params.keyword) {
            this.setState({ isLoading: true })
            let response = await getSearch(this.props.match.params.keyword)
            if (response) this.setState({ isLoading: false })
            if (response && response.data.err === 0) {
                this.setState({
                    dataSearch: response.data.data
                })
            }
        }
        if (prevProps.refreshPlayState !== this.props.refreshPlayState) {
            if (this.props.refreshPlayState === '6') {
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
    handlePlayMusic = item => {
        this.props.refreshPlay('6')
        this.setState({
            idSong: item.encodeId,
            playMusic: true
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
                customPlayMode: true
            })
        }
    }
    handlePlaySong = (type, idSong) => {
        if (type === "song")
            this.setState({
                type: 4,
                playMusic: true,
                idSong: idSong
            })
    }
    render() {
        let { dataSearch } = this.state
        return (
            <>
                <div className="detail-search-container">
                    <div className="header">Kết quả tìm kiếm</div>
                    {dataSearch ? (
                        <div className="content-search">
                            <div className="top-search">
                                <h3>
                                    Top kết quả tìm kiếm <span>{`"${this.props.keyword}"`}:</span>
                                </h3>
                                {dataSearch.top ? (
                                    <>
                                        <div className="box-top-search">
                                            <div className="wrap-img">
                                                <img src={dataSearch.top.thumbnail} alt="img" />
                                            </div>
                                            {dataSearch.top.objectType === "song" ? (
                                                <div className="info">
                                                    <div className="name">{dataSearch.top.title}</div>
                                                    <div className="artist">{dataSearch.top.artistsNames}</div>
                                                    <div
                                                        onClick={() =>
                                                            this.handlePlaySong(
                                                                dataSearch.top.objectType,
                                                                dataSearch.top.encodeId
                                                            )
                                                        }
                                                        className="play-btn"
                                                    >
                                                        Chơi nhạc
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="info">
                                                    <div className="name">{dataSearch.top.name}</div>
                                                    <div
                                                        onClick={() =>
                                                            this.props.history.push(
                                                                `/detail-singer/${dataSearch.top.alias}`
                                                            )
                                                        }
                                                        className="play-btn"
                                                    >
                                                        Chi tiết
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="songs">
                                            <h3>Bài hát</h3>
                                            {dataSearch.songs && (
                                                <PlayListWithoutCD
                                                    rank={false}
                                                    playlist={dataSearch.songs}
                                                    idSong={this.state.idSong}
                                                    handlePlayMusic={this.handlePlayMusic}
                                                />
                                            )}
                                        </div>
                                        <div className="playlist-album">
                                            {dataSearch.playlists && (
                                                <BoxSlider
                                                    h3={"Playlist/Album"}
                                                    data={dataSearch.playlists}
                                                    detail={true}
                                                />
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    "Không có kết quả!"
                                )}
                            </div>
                        </div>
                    ) : (
                        "Không có kết quả"
                    )}
                </div>
                {this.state.playMusic && (
                    <PlayerMusic2
                        idSong={this.state.idSong}
                        type={this.state.type}
                        album={
                            this.state.dataSearch && this.state.dataSearch.songs ? this.state.dataSearch.songs : null
                        }
                        getCurrentSong={this.getCurrentSong}
                        handleCustomPlay={this.handleCustomPlay}
                        customPlayMode={this.state.customPlayMode}
                    />
                )}
                {this.state.isLoading && <Loading2 />}
            </>
        )
    }
}
const mapStateToProps = state => {
    return {
        keyword: state.keyword,
        refreshPlayState: state.refreshPlay
    }
}

const mapDispatchToProps = dispatch => {
    return {
        refreshPlay: (id) => dispatch(actions.refreshPlay(id))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailSearch))
