import './DetailAlbum.scss';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getDetailPlaylistByIdService, handleAddAlbum, handleDeleteLike, handleGetNewPlaylist, updatePlaylistById } from '../../services/userService'
import * as actions from '../../store/actions'
import { handleAddRecent, handlePersonal } from '../../services/userService'
import Swal from 'sweetalert2';
import Loading2 from '../Loading2/Loading2';


import PlayerMusic2 from '../BoxPlayMusic/PlayerMusic2'


class DetailAlbum extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataAlbum: null, //full data detail album page
            isShowPlayButon: false, // show/hide button play in box avatar
            playlistSong: null, //list songs of album
            idSong: null, // id selected song
            avatarSong: null,
            nameSong: null,
            artist: null,
            duration: null,
            playMusic: false, // hide/show player music
            playCD: 'start', // CD animation
            customPlayMode: false,
            isLiked: false,
            isThisPlay: false,
            index: null,
            isShowPopup: false,
            allPlaylist: null,
            isLoading: false
        }
    }
    async componentDidMount() {
        this.setState({ isLoading: true })
        let response = await getDetailPlaylistByIdService(this.props.match.params.id)
        if (response) this.setState({ isLoading: false })
        if (response && response.data.err === 0 && response.data.data && response.data.data.song) {
            this.setState({
                dataAlbum: response.data.data,
                playlistSong: response.data.data.song.items
            })
        }
        let user = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null
        if (user) {
            let response = await handlePersonal(user.id)
            if (response && response[1] && response[1].data.err === 0) {
                let check = response[1].data.response.find(item => item.idAlbum === this.props.match.params.id) //
                if (check) this.setState({ isLiked: true })
            }
        }
        if (localStorage.getItem('user')) {
            let response = await handleGetNewPlaylist(JSON.parse(localStorage.getItem('user')).id)
            if (response && response.data.err === 0) {
                this.setState({
                    allPlaylist: response.data.playlist
                })
            }
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.refreshPlayState !== this.props.refreshPlayState) {
            if (this.props.refreshPlayState === '1') {
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
    handleConvertTimestampToDate = (timestamp) => {
        let date = new Date(timestamp * 1000)
        let day = ('' + date.getDate()).length === 1 ? `0${'' + date.getDate()}` : '' + date.getDate()
        let month = ('' + (date.getMonth() + 1)).length === 1 ? `0${'' + (date.getMonth() + 1)}` : '' + (date.getMonth() + 1)
        return `${day}/${month}/${date.getFullYear()}`
    }
    handleTime = (secondsTotal) => {
        let hour = Math.floor(secondsTotal / 3600) === 0 ? '' : Math.floor(secondsTotal / 3600) + ':'
        let minutesTotal = secondsTotal % 3600
        let minutes = Math.floor(minutesTotal / 60) === 0 ? '00:' : Math.floor(minutesTotal / 60) + ':'
        let seconds = minutesTotal % 60
        if (('' + seconds).length === 1) {
            seconds = '0' + seconds
        }
        if (('' + minutes).length === 2) {
            minutes = '0' + minutes
        }

        return `${hour}${minutes}${seconds}`

    }
    handleMouseOver = () => {
        this.setState({
            isShowPlayButon: true
        })
    }
    handleMouseOut = () => {
        this.setState({
            isShowPlayButon: false
        })
    }
    handlePlayStart = async (item) => {
        this.handlePlayMusic(item)
        // console.log(this.state.dataAlbum);
        let idUserAnon
        let user = JSON.parse(localStorage.getItem('user'))
        if (!user) {
            idUserAnon = (Math.random() * Math.pow(10, 6)).toFixed(0)
            localStorage.setItem('user', JSON.stringify({ id: idUserAnon }))
        } else {
            idUserAnon = user.id
        }
        if (localStorage.getItem('user')) {
            let payload = {
                idSong: item.encodeId,
                avatarSong: item.thumbnail,
                titleSong: item.title,
                artistSong: item.artistsNames,
                dayRelease: item.releaseDate,
                duartion: item.duration,
                idUser: idUserAnon,
                idAlbum: this.state.dataAlbum.encodeId,
                avatarAlbum: this.state.dataAlbum.thumbnailM
            }
            let response = await handleAddRecent(payload)
            if (response && response.data.err === 0) {
                this.props.updateRecent()
            }
        }
    }
    handlePlayMusic = (item) => {
        // console.log(item);
        this.props.refreshPlay('1')
        this.setState({
            idSong: item.encodeId,
            artist: item.artistsNames,
            nameSong: item.title,
            avatarSong: item.thumbnail,
            duration: item.duration,
            playMusic: true
        })
    }
    handleRotateCD = (signal) => {
        this.setState({
            playCD: signal
        })
    }
    handleRemotePlay = () => {
        this.props.pausePlayer()
        this.setState({
            customPlayMode: false
        })
    }
    getCurrentSong = (id) => {
        this.setState({
            idSong: id
        })
    }
    handleCustomPlay = (playlistSong) => {
        if (playlistSong) {
            let randomIndexSong = Math.round(Math.random() * playlistSong.length - 1, 0)
            this.setState({
                idSong: playlistSong[randomIndexSong].encodeId,
                avatarSong: playlistSong[randomIndexSong].thumbnail,
                nameSong: playlistSong[randomIndexSong].title,
                artist: playlistSong[randomIndexSong].artistsNames,
                duration: playlistSong[randomIndexSong].duration,
                playMusic: true,
                customPlayMode: true
            })
        }
    }
    toggleLike = async () => {
        if (localStorage.getItem('user')) {
            let user = JSON.parse(localStorage.getItem('user'))
            if (this.state.isLiked) {
                console.log(this.props.match.params.id);
                let response = await handleDeleteLike({
                    idUser: user.id,
                    idAlbum: this.props.match.params.id,
                    type: 'album',
                    idSinger: 'none'
                })
                if (response && response.data.err === 0) {
                    this.setState({
                        isLiked: false
                    })
                }
            } else {
                let response = await handleAddAlbum({
                    idUser: JSON.parse(localStorage.getItem('user')).id,
                    idAlbum: this.state.dataAlbum.encodeId,
                    avatar: this.state.dataAlbum.thumbnail,
                })
                if (response && response.data.err === 0) {
                    this.setState({
                        isLiked: true
                    })
                }
            }
        } else {
            Swal.fire({
                title: "Hey, bro!",
                text: `Bạn hãy đăng nhập để sử dụng được chức năng này ~`,
                icon: "warning",
                confirmButtonText: "Đi tới đăng nhập",
                cancelButtonText: `Không cần`,
                showCancelButton: true,
            }).then((result) => {
                if (result.value) {
                    this.props.history.push('/login')
                }
            })

        }
    }
    handleOnmouseOutPopUP = (event) => {
        event.stopPropagation()
        this.setState({
            isShowPopup: false
        })
    }
    handleOnMouseOverPopup = (event) => {
        event.stopPropagation()
        this.setState({
            isShowPopup: true
        })
    }
    handleAddPlaylist = (item, event) => {
        if (this.props.handleAddPlaylist) {
            this.props.handleAddPlaylist(item, event)
        }
        else {
            event.stopPropagation()
            this.setState({
                isShowPopup: true
            })
        }
    }
    handleAddPlaylistRemote = async (item2, item, event) => {
        event.stopPropagation()
        let payload = {
            idSong: item.encodeId,
            thumbnail: item.thumbnail,
            title: item.title,
            artist: item.artistsNames,
            releasedDate: item.releaseDate,
            duration: item.duration,
            idUser: item2.idUser,
            idPlaylist: item2.idPlaylist,
            type: 'song'
        }
        let response = await updatePlaylistById(payload)
        if (response && response.data.err === 0) {
            Swal.fire({
                title: "Done!",
                text: `Đã thêm vào playlist ${item2.namePlaylist}`,
                icon: "success",
                confirmButtonText: "Tôi biết rồi"
            })
        } else {
            Swal.fire({
                title: "Oops!",
                text: `${response.data.msg}`,
                icon: "warning",
                confirmButtonText: "Tôi biết rồi"
            })
        }
    }
    handleOnmouseOver = (index) => {
        this.setState({
            index: index
        })
    }
    handleOnmouseOut = () => {
        this.setState({
            index: null,

        })
    }

    render() {
        let { dataAlbum, playlistSong } = this.state
        return (
            <Fragment>
                <div className='detail-album-container'>
                    {dataAlbum && <div className="content-detail-album-container">
                        <div className="under-cd"></div>
                        <div className="cd-thubmail">
                            <div
                                onMouseOver={() => this.handleMouseOver()}
                                onMouseOut={() => this.handleMouseOut()}
                                className="cd-border">
                                {this.state.isShowPlayButon && <div className="buttons-overwritten">
                                    <i title='Play' className="fa-regular fa-circle-play"></i>
                                </div>}
                                <div className={this.state.playCD === 'start' ? 'cd-wrap' : this.state.playCD ? 'cd-wrap actived' : 'cd-wrap effect-boder'}>
                                    <img src={dataAlbum.thumbnailM} alt="cd-thumbnail" />
                                </div>
                            </div>
                            <div className="title-cd">{dataAlbum.title}</div>
                            <div className="wrap-info-album">
                                <div className="updatedAt">{`Cập nhật: ${this.handleConvertTimestampToDate(dataAlbum.contentLastUpdate)}`}</div>
                                <div className="artists">{dataAlbum.artistsNames}</div>
                                <div className="like-count">
                                    Lượt thích:
                                    <i className="fa-solid fa-heart"></i>
                                    {dataAlbum.like}
                                </div>
                                {!this.state.isLiked
                                    ? <div onClick={() => this.toggleLike()} className="like">Yêu thích</div>
                                    : <div className='dislike' onClick={() => this.toggleLike()}>Bạn đã thích album này ~</div>}
                            </div>
                            {!this.props.isPlaying || !this.state.playMusic
                                ? <button
                                    onClick={() => this.handleCustomPlay(playlistSong)}
                                    type='button'
                                    className='custom-play'>
                                    <i className="fa-solid fa-play"></i>
                                    PHÁT NGẪU NHIÊN
                                </button>
                                : <button
                                    type='button'
                                    onClick={() => {
                                        // this.handleRotateCD(false)
                                        this.handleRemotePlay()
                                    }
                                    }
                                    className='custom-play'>
                                    <i className="fa-solid fa-pause"></i>
                                    TẠM DỪNG PHÁT
                                </button>}
                        </div>
                        <div className="list-music">
                            <div className="desc-album"><span className='opty-5'>Lời tựa  </span>{dataAlbum.sortDescription}</div>
                            <div className="header-playlist">
                                <span className='opty-5'>
                                    <i className="fa-solid fa-guitar"></i>
                                    BÀI HÁT
                                </span>
                                <span className='opty-5'>CA SĨ</span>
                                <span className='opty-5'>THỜI GIAN</span>
                            </div>
                            {playlistSong && playlistSong.length > 0 && playlistSong.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        onMouseOver={() => this.handleOnmouseOver(index)}
                                        onMouseOut={() => this.handleOnmouseOut()}
                                        onClick={() => this.handlePlayStart(item)}
                                        className={this.state.idSong === item.encodeId ? "box-song selected-song" : "box-song"}>
                                        <div className="wrap-img-song">
                                            <i className="fa-solid fa-music opty-5"></i>
                                            <div className="box-img"><img src={item.thumbnail} alt="img" /></div>
                                            <div className="info-song">
                                                <div className={this.state.idSong === item.encodeId ? 'title-song-selected' : ''}>{item.title}</div>
                                            </div>
                                        </div>
                                        <div className="album-detail opty-5">{item.artistsNames}</div>
                                        {this.state.index === index
                                            ? <Fragment>
                                                {this.props.minus
                                                    ? <small><i onClick={(event) => this.props.handleDeleteSongPlaylist(item, event)} title='Xóa khỏi playlist' className="fa-solid fa-minus"></i></small>
                                                    : <> {this.state.isShowPopup && <div
                                                        onMouseOut={(event) => this.handleOnmouseOutPopUP(event)}
                                                        onMouseOver={(event) => this.handleOnMouseOverPopup(event)}
                                                        className="pop-up-playlist"
                                                    >
                                                        <div className="header-popup">Chọn playlist</div>
                                                        {this.state.allPlaylist
                                                            ? <Fragment>
                                                                {this.state.allPlaylist && this.state.allPlaylist.length > 0 && this.state.allPlaylist.map((item2, index) => {
                                                                    return (
                                                                        <div key={index} onClick={(event) => this.handleAddPlaylistRemote(item2, item, event)} className="item">{item2.namePlaylist}</div>
                                                                    )
                                                                })}
                                                            </Fragment>
                                                            : 'Bạn chưa tạo playlist nào !'}
                                                    </div>}
                                                        <small onClick={(event) => this.handleAddPlaylist(item, event)}><i title='Thêm vào playlist' className="fa-solid fa-plus"></i></small>

                                                    </>}
                                            </Fragment>
                                            : <div className="time-song opty-5">{this.handleTime(item.duration)}</div>}
                                    </div>
                                )
                            })}
                            <div className="total">{`${dataAlbum.song.total} bài hát - Tổng thời gian: ${this.handleTime(dataAlbum.song.totalDuration)}`}</div>
                        </div>
                    </div>}
                </div>
                {this.state.playMusic && <PlayerMusic2
                    type={4}
                    album={playlistSong}
                    idSong={this.state.idSong}
                    avatarSong={this.state.avatarSong}
                    nameSong={this.state.nameSong}
                    artist={this.state.artist}
                    duration={this.state.duration}
                    handleRotateCD={this.handleRotateCD}
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
        isPlaying: state.isPlaying,
        refreshPlayState: state.refreshPlay

    };
};

const mapDispatchToProps = dispatch => {
    return {
        pausePlayer: () => dispatch(actions.pausePlayer()),
        updateRecent: () => dispatch(actions.updateRecent()),
        refreshPlay: (id) => dispatch(actions.refreshPlay(id))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailAlbum));
