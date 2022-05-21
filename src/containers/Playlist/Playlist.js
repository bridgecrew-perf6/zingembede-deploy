import './Playlist.scss';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getSearch, handleGetNewPlaylistById, updatePlaylistById, deleteSongPlaylist } from "../../services/userService"
import PlayListWithoutCD from "../PlayListWithoutCD/PlayListWithoutCD"
import * as actions from '../../store/actions'
import PlayerMusic2 from '../BoxPlayMusic/PlayerMusic2';
import Loading2 from '../Loading2/Loading2';


// chèn player
// add playlist from anywhere


class Playlist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataPlaylist: null,
            name: null,
            suggestedSongs: null,
            idSong: null,
            isEdit: false,
            createdAt: null,
            playMusic: false,
            customPlayMode: false,
            isLoading: false
        }
    }

    async componentDidMount() {
        this.setState({ isLoading: true })
        let responsePlaylist = await handleGetNewPlaylistById({ idUser: JSON.parse(localStorage.getItem('user')).id, idPlaylist: this.props.match.params.id })
        if (responsePlaylist) this.setState({ isLoading: false })
        if (responsePlaylist && responsePlaylist.data.err === 0) {
            this.setState({
                dataPlaylist: responsePlaylist.data.playlist.filter(item => item.idSong !== null).map(item => {
                    return {
                        encodeId: item.idSong,
                        title: item.title,
                        thumbnail: item.thumbnail,
                        artistsNames: item.artist,
                        duration: item.duration,
                        releaseDate: Date.parse(new Date(item.releasedDate)) / 1000
                    }
                }).reverse(),
                name: responsePlaylist.data.playlist[0].namePlaylist,
                createdAt: this.handleDateCreated(responsePlaylist.data.playlist[0].createdAt)
            }, async () => {
                let keyword = this.state.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ").join("-")
                this.setState({ isLoading: true })
                let response = await getSearch(keyword)
                if (response) this.setState({ isLoading: false })
                if (response && response.data.err === 0) {
                    this.setState({
                        suggestedSongs: response.data.data.songs || null,
                    })
                }
            })
        }
    }
    async componentDidUpdate(prevProps) {
        if ((prevProps.match.params.id !== this.props.match.params.id) || (prevProps.updatePlaylist !== this.props.updatePlaylist)) {
            this.setState({ isLoading: true })
            let responsePlaylist = await handleGetNewPlaylistById({ idUser: JSON.parse(localStorage.getItem('user')).id, idPlaylist: this.props.match.params.id })
            if (responsePlaylist) this.setState({ isLoading: false })
            if (responsePlaylist && responsePlaylist.data.err === 0) {
                this.setState({
                    dataPlaylist: responsePlaylist.data.playlist.filter(item => item.idSong !== null).map(item => {
                        return {
                            encodeId: item.idSong,
                            title: item.title,
                            thumbnail: item.thumbnail,
                            artistsNames: item.artist,
                            duration: item.duration,
                            releaseDate: Date.parse(new Date(item.releasedDate)) / 1000
                        }
                    }).reverse(),
                    name: responsePlaylist.data.playlist[0].namePlaylist,
                    createdAt: this.handleDateCreated(responsePlaylist.data.playlist[0].createdAt)
                }, async () => {
                    let keyword = this.state.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ").join("-")
                    this.setState({ isLoading: true })
                    let response = await getSearch(keyword)
                    if (response) this.setState({ isLoading: false })
                    if (response && response.data.err === 0) {
                        this.setState({
                            suggestedSongs: response.data.data.songs || null
                        })
                    }
                })
            }
        }
        if (prevProps.refreshPlayState !== this.props.refreshPlayState) {
            if (this.props.refreshPlayState === '9') {
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
    handleDateCreated = (date) => {
        let dateType = new Date(date)
        return `${dateType.getDate()}/${dateType.getMonth() + 1}/${dateType.getFullYear()}`
    }
    handlePlayMusic = item => {
        this.props.refreshPlay('9')
        this.setState({
            idSong: item.encodeId,
            playMusic: true
        })
    }
    goEditName = () => {
        this.setState({
            isEdit: true
        })
    }
    handleOnchange = (event) => {
        this.setState({
            name: event.target.value
        })
    }
    handleEditName = async () => {
        let response = await updatePlaylistById({
            idUser: JSON.parse(localStorage.getItem('user')).id,
            idPlaylist: this.props.match.params.id,
            name: this.state.name,
            type: 'name'
        })
        if (response && response.data.err === 0) {
            this.setState({
                isEdit: false
            })
        }
    }
    handleConvertTimestampToDate = (timestamp) => {
        let date = new Date(timestamp * 1000)
        let day = ('' + date.getDate()).length === 1 ? `0${'' + date.getDate()}` : '' + date.getDate()
        let month = ('' + (date.getMonth() + 1)).length === 1 ? `0${'' + (date.getMonth() + 1)}` : '' + (date.getMonth() + 1)
        return `${day}/${month}/${date.getFullYear()}`
    }
    handleAddPlaylist = async (item, event) => {
        if (event) event.stopPropagation()
        let payload = {
            idSong: item.encodeId,
            thumbnail: item.thumbnail,
            title: item.title,
            artist: item.artistsNames,
            releasedDate: this.handleConvertTimestampToDate(item.releaseDate),
            duration: item.duration,
            idUser: JSON.parse(localStorage.getItem('user')).id,
            idPlaylist: this.props.match.params.id,
            type: 'song'
        }
        let response = await updatePlaylistById(payload)
        if (response && response.data.err === 0) {
            this.props.refresh()
        }
    }
    handleDeleteSongPlaylist = async (item, event) => {
        if (event) event.stopPropagation()
        let payload = {
            idUser: JSON.parse(localStorage.getItem('user')).id,
            idPlaylist: this.props.match.params.id,
            idSong: item.encodeId,
        }
        let response = await deleteSongPlaylist(payload)
        if (response && response.data.err === 0) {
            this.props.refresh()
        }
    }
    getCurrentSong = (id) => {
        this.setState({
            idSong: id
        })
    }
    handleCustomPlay = (playlistSong) => {
        if (playlistSong) {
            let randomIndexSong = (Math.random() * playlistSong.length - 1).toFixed(0)
            this.setState({
                idSong: playlistSong[randomIndexSong].encodeId,
                playMusic: true,
                customPlayMode: true
            })
        }
    }

    render() {
        let { name, dataPlaylist, suggestedSongs } = this.state

        return (
            <Fragment>
                <div className='playlist-container'>
                    <div className="cd-thumbnail">
                        <div className="wrap-img">
                            <div className="img"></div>
                            {this.state.isEdit
                                ? <div className='wrap-input'>
                                    <input value={this.state.name} onChange={(event) => this.handleOnchange(event)} className='edit-name' type='text' />
                                    <span onClick={() => this.handleEditName()} className="oke">OK</span>
                                </div>
                                : <div className="name">{name}<i onClick={() => this.goEditName()} title='Sửa tên' className="fa-solid fa-pencil"></i></div>}
                            <div className="author"><span>Tạo bởi: </span>{JSON.parse(localStorage.getItem('user')).name}</div>
                            {this.state.createdAt && <div className="createAt"><span>Ngày tạo: </span>{this.state.createdAt}</div>}
                        </div>
                    </div>
                    <div className="songs-section">
                        {dataPlaylist && dataPlaylist.length > 0
                            ? <Fragment>
                                <div className="header-list">
                                    <span>Bài hát</span><span>Ca sĩ</span><span>Thời gian</span>
                                </div>
                                <PlayListWithoutCD
                                    rank={false}
                                    playlist={dataPlaylist}
                                    idSong={this.state.idSong}
                                    handlePlayMusic={this.handlePlayMusic}
                                    minus={true}
                                    handleDeleteSongPlaylist={this.handleDeleteSongPlaylist}
                                />
                            </Fragment>
                            : <div className="no-songs">
                                <i className="fa-brands fa-itunes-note"></i>
                                <p>Chưa có bài hát trong playlist này của bạn</p>
                            </div>}
                        <div className="suggested-songs">
                            <h4 className='title'>Bài hát đề xuất</h4>
                            <small className='desc'>Bài hát được đề xuất dựa trên TÊN của playlist</small>
                            {suggestedSongs && (
                                <PlayListWithoutCD
                                    rank={false}
                                    playlist={suggestedSongs}
                                    idSong={this.state.idSong}
                                    handlePlayMusic={this.handlePlayMusic}
                                    handleAddPlaylist={this.handleAddPlaylist}
                                />
                            )}
                        </div>
                    </div>
                </div>
                {this.state.playMusic && <PlayerMusic2
                    idSong={this.state.idSong}
                    type={4}
                    album={this.state.suggestedSongs}
                    getCurrentSong={this.getCurrentSong}
                    handleCustomPlay={this.handleCustomPlay}
                    customPlayMode={this.state.customPlayMode}
                />}
                {this.state.isLoading && <Loading2 />}
            </Fragment>
        )
    }
}
const mapStateToProps = state => {
    return {
        updatePlaylist: state.refresh,
        refreshPlayState: state.refreshPlay
    };
};

const mapDispatchToProps = dispatch => {
    return {
        refresh: () => dispatch(actions.refresh()),
        refreshPlay: (id) => dispatch(actions.refreshPlay(id))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Playlist));
