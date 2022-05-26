import './PlayListWithoutCD.scss';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { handleAddRecent, handleGetNewPlaylist, updatePlaylistById } from '../../services/userService'
import * as actions from '../../store/actions'
import Swal from 'sweetalert2';
import Loading2 from '../Loading2/Loading2';





class PlayListWithoutCD extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isHover: false,
            index: null,
            allPlaylist: null,
            isShowPopup: false,
            isLoading: false
        }
    }
    async componentDidMount() {
        if (localStorage.getItem('user')) {
            this.setState({ isLoading: true })
            let response = await handleGetNewPlaylist(JSON.parse(localStorage.getItem('user')).id)
            if (response) this.setState({ isLoading: false })
            if (response && response.data.err === 0) {
                this.setState({
                    allPlaylist: response.data.playlist
                })
            }
        }
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
    handlePlayStart = async (item) => {
        this.props.handlePlayMusic(item)
        let user = JSON.parse(localStorage.getItem('user'))
        let idUserAnon
        if (!user) {
            idUserAnon = (Math.random() * Math.pow(10, 6)).toFixed(0)
            localStorage.setItem('user', JSON.stringify({ id: idUserAnon }))
        } else {
            idUserAnon = user.id
        }
        let payload = {
            idSong: item.encodeId,
            avatarSong: item.thumbnail,
            titleSong: item.title,
            artistSong: item.artistsNames,
            dayRelease: item.releaseDate,
            duartion: item.duration,
            idUser: idUserAnon,
            idAlbum: 'none'
        }
        let response = await handleAddRecent(payload)
        if (response && response.data.err === 0) {
            this.props.updateRecent()
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
        this.setState({ isLoading: true })
        let response = await updatePlaylistById(payload)
        if (response) this.setState({ isLoading: false })
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

    render() {
        let { playlist, idSong, rank } = this.props

        return (
            <Fragment>
                <div className='play-without-cd'>
                    {playlist && playlist.length > 0 && playlist.map((item, index) => {
                        return (
                            <div
                                key={index}
                                onMouseOver={() => this.handleOnmouseOver(index)}
                                onMouseOut={() => this.handleOnmouseOut()}
                                onClick={() => this.handlePlayStart(item)}
                                className={idSong === item.encodeId ? "box-song selected-song" : "box-song"}>
                                <div className="wrap-img-song">
                                    {rank && <div className="rank">{index + 1}</div>}
                                    <div className="box-img"><img src={item.thumbnail} alt="img" /></div>
                                    <div className="info-song">
                                        <div className={idSong === item.encodeId ? 'title-song-selected' : ''}>{item.title}</div>
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
                </div>
                {this.state.isLoading && <Loading2 />}
            </Fragment>
        )
    }
}
const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateRecent: () => dispatch(actions.updateRecent())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayListWithoutCD);
