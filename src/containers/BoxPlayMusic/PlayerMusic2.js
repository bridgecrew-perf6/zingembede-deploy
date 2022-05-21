import "./PlayerMusic.scss"
import React, { Component } from "react"
import { connect } from "react-redux"
import { getSongByIdService, getInfoSong, handleLikedSong, getLikedSong, deleteLikedSong } from "../../services/userService"
import Swal from "sweetalert2"
import * as actions from "../../store/actions"
import { withRouter } from "react-router"
import Loading2 from "../Loading2/Loading2"

var idInterval = null

class PlayerMusic2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            linkPlaySong: null, //link the song
            detailSong: null, // full info the song
            isPlaying: false, // flag playing the song
            percentProgress: 0,
            isPaused: true,
            currentVolume: 100,
            currentAlbum: null, // playlist album
            isNext: true,
            isPrev: true,
            idSong: null,
            currentTimeSong: 0,
            heart: false,
            isLoading: false
        }
        this.audioEl = new Audio("https://ia800206.us.archive.org/16/items/SilentRingtone/silence_64kb.mp3") // demo 1 any source mp3 to avoid error init new audio
    }

    async componentDidMount() {
        this.handleGetFullSongInfo(this.props.idSong)
        this.props.playPlayer() // set state play for redux store
        let user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            let response = await getLikedSong({
                idUser: user.id,
                idSong: this.props.idSong,
                type: 'song'
            })
            if (response && response.data.err === 0) {
                this.setState({
                    heart: true
                })
            } else {
                this.setState({
                    heart: false
                })
            }
        }
    }
    async componentDidUpdate(prevProps) {
        //update song
        if (prevProps.idSong !== this.props.idSong) {
            this.handleGetFullSongInfo(this.props.idSong)
            this.props.playPlayer()
            let user = JSON.parse(localStorage.getItem('user'))
            if (user) {
                let response = await getLikedSong({
                    idUser: user.id,
                    idSong: this.props.idSong,
                    type: 'song'
                })
                if (response && response.data.err === 0) {
                    this.setState({
                        heart: true
                    })
                } else {
                    this.setState({
                        heart: false
                    })
                }
            }
        }
        //update status play/pause the song
        if (prevProps.isPlayingRedux !== this.props.isPlayingRedux) {
            this.setState(
                {
                    isPlaying: this.props.isPlayingRedux
                },
                () => this.playMusic(this.state.isPlaying)
            )
        }
    }
    componentWillUnmount() {
        this.playMusic(false)
    }
    //get link of song and detail data of song then set states
    handleGetFullSongInfo = async idSong => {
        let [response, detailSong] = await Promise.all([getSongByIdService(idSong), getInfoSong(idSong)])
        if (response && response.data.err === 0) {
            this.setState(
                {
                    linkPlaySong: response.data.data,
                    idSong: idSong
                },
                () => {
                    if (this.state.linkPlaySong) {
                        this.handleEnableButtonNextNPrev() // check enable/disable buttons next and prev
                        this.audioEl.load()
                        this.audioEl.src = this.state.linkPlaySong["128"]
                        setTimeout(() => this.playMusic(true), 1000)
                    }
                }
            )
        } else {
            //alert VIP song
            this.setState(
                {
                    isPlaying: false,
                    linkPlaySong: ""
                },
                () => {
                    Swal.fire({
                        title: "Oops!",
                        text: response.data.msg,
                        icon: "warning",
                        confirmButtonText: "Tôi biết rồi"
                    })
                }
            )
        }
        if (detailSong && detailSong.data.err === 0) {
            this.setState({
                detailSong: detailSong.data.data
            })
        }
    }
    // check enable/disable buttons next and prev
    handleEnableButtonNextNPrev = () => {
        if (this.props.type !== 1) {
            let indexNext = this.getIndexNextAndPrevSong()[1]
            let indexPrev = this.getIndexNextAndPrevSong()[0]
            if (this.props.album && this.props.album.length <= indexNext) {
                this.setState({
                    isNext: false
                })
            } else {
                this.setState({
                    isNext: true
                })
            }
            if (this.props.album && indexPrev < 0) {
                this.setState({
                    isPrev: false
                })
            } else {
                this.setState({
                    isPrev: true
                })
            }
        }
    }
    // play or pause the song
    playMusic = async flag => {
        if (flag) {
            this.setState({
                isPlaying: true
            })
            let isPlaying =
                this.audioEl.currentTime > 0 &&
                !this.audioEl.paused &&
                !this.audioEl.ended &&
                this.audioEl.readyState > this.audioEl.HAVE_CURRENT_DATA

            if (!isPlaying) {
                this.audioEl.play()
            }

            // await this.audioEl.play()
            if (this.props.type === 4) {
                this.props.playPlayer() // sync status play/pause between components
                if (this.props.handleRotateCD) this.props.handleRotateCD(true)
            }
            window.requestAnimationFrame(this.handleAnimationProgress)
            this.updateCurrentTime()

            //handle audio END
            this.audioEl.addEventListener("ended", () => {
                if (this.props.customPlayMode) {
                    this.props.handleCustomPlay(this.props.album)
                } else {
                    this.audioEl.pause()
                    this.audioEl.load()
                    setTimeout(() => this.handleNextSong(), 1000)
                }
            })
        } else {
            this.setState({
                isPlaying: false
            })
            clearInterval(idInterval) // combo clear interval
            idInterval = 0
            if (!this.audioEl.paused) this.audioEl.pause()
            if (this.props.type === 4) {
                this.props.pausePlayer()
                if (this.props.handleRotateCD) this.props.handleRotateCD(false)
            }
        }
    }
    // handle smoothly progress bar while play music
    handleAnimationProgress = () => {
        const progressBar = document.querySelector(".progress-bar")
        const elapse = document.querySelector(".elapse")
        let rectProgressBar
        if (progressBar && elapse) {
            rectProgressBar = progressBar.getBoundingClientRect()
            elapse.style.width = `${(this.audioEl.currentTime / this.audioEl.duration) * rectProgressBar.width}px`
            window.requestAnimationFrame(this.handleAnimationProgress)
        }
    }
    //flash time music by click progress bar
    handleOnClickProgressBar = event => {
        let rectProgressbar = document.querySelector(".progress-bar").getBoundingClientRect()
        let positionClick = event.pageX
        this.audioEl.currentTime =
            ((positionClick - rectProgressbar.left) * this.audioEl.duration) / rectProgressbar.width
        if (document.querySelector(".progress-bar") && document.querySelector(".elapse")) {
            document.querySelector(".elapse").style.width = `${positionClick - rectProgressbar.left}px`
            window.requestAnimationFrame(this.handleAnimationProgress)
        }
    }
    handleOnChangeVolume = event => {
        const volume = document.querySelector(".line-volume")
        const elapse = document.querySelector(".elapse-volume")
        let rectVolume = volume.getBoundingClientRect()
        let percent = ((event.pageX - rectVolume.left) / rectVolume.width).toFixed(1)
        let color = percent <= 0.7 ? "blue" : "red"
        elapse.style.cssText = `border-bottom: ${percent * 20}px solid ${color};
        border-left: ${percent * 200}px solid transparent;`
        this.audioEl.volume = percent
        this.setState({
            currentVolume: percent * 100
        })
    }
    ToggleMute = () => {
        const elapse = document.querySelector(".elapse-volume")
        if (this.audioEl.volume !== 0) {
            this.audioEl.volume = 0
            elapse.style.cssText = `border-bottom: 0px solid;border-left: 0px solid transparent;`
            this.setState({
                currentVolume: 0
            })
        } else {
            this.audioEl.volume = 0.5
            elapse.style.cssText = `border-bottom: 10px solid blue; border-left: 100px solid transparent;`
            this.setState({
                currentVolume: 50
            })
        }
    }
    //get index previous and next song in the current album
    getIndexNextAndPrevSong = () => {
        if (this.props.album && this.state.idSong) {
            for (let i = 0; i < this.props.album.length; i++) {
                if (this.props.album[i].encodeId === this.state.idSong) {
                    return [i - 1, i + 1]
                }
            }
        }
    }
    // go to the next song
    handleNextSong = () => {
        if (this.state.isNext) {
            if (this.props.type !== 1) {
                let indexNextSong = this.getIndexNextAndPrevSong()[1]
                if (this.props.album) {
                    if (!(indexNextSong >= this.props.album.length)) {
                        this.handleGetFullSongInfo(this.props.album[indexNextSong].encodeId)
                        this.props.getCurrentSong(this.props.album[indexNextSong].encodeId)
                    }
                }
            }
        } else {
            Swal.fire({
                title: "Oops!",
                text: "Bài cuối cùng rôi",
                icon: "warning",
                confirmButtonText: "Tôi biết rồi"
            })
            setTimeout(() => this.playMusic(false), 1000)
        }
    }
    // back to the previous song
    handlePrevSong = async () => {
        if (this.props.type !== 1 && this.state.isPrev) {
            let indexPrevSong = this.getIndexNextAndPrevSong()[0]
            if (this.props.album) {
                if (indexPrevSong >= 0) {
                    await this.handleGetFullSongInfo(this.props.album[indexPrevSong].encodeId)
                    this.props.getCurrentSong(this.props.album[indexPrevSong].encodeId)
                }
            }
        }
    }
    handleStartAgain = async () => {
        if (this.props.type !== 1) {
            await this.handleGetFullSongInfo(this.props.album[0].encodeId)
            this.props.playPlayer()
            this.props.getCurrentSong(this.props.album[0].encodeId)
        }
    }
    // convert seconds to hh/mm/ss
    formatTimeMusic = secondsTotal => {
        let hour = Math.floor(secondsTotal / 3600) === 0 ? "" : Math.floor(secondsTotal / 3600) + ":"
        let minutesTotal = secondsTotal % 3600
        let minutes = Math.floor(minutesTotal / 60) === 0 ? "00:" : Math.floor(minutesTotal / 60) + ":"
        let seconds = minutesTotal % 60
        if (("" + seconds).length === 1) {
            seconds = "0" + seconds
        }
        if (("" + minutes).length === 2) {
            minutes = "0" + minutes
        }
        return `${hour}${minutes}${seconds}`
    }
    // setinerval run time music
    updateCurrentTime = () => {
        if (idInterval === 0 || !idInterval) {
            if (this.audioEl.currentTime < this.audioEl.duration) {
                idInterval = setInterval(() => {
                    this.setState({
                        currentTimeSong: this.audioEl.currentTime.toFixed(0)
                    })
                }, 1000)
            } else {
                clearInterval(idInterval)
                idInterval = 0
            }
        }
    }
    handleLikeSong = async () => {
        let user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            let response = await handleLikedSong({
                idUser: user.id,
                idSong: this.state.idSong
            })
            if (response && response.data.err === 0) {
                this.setState({
                    heart: true
                })
            }
        } else {
            this.props.history.push('login')
        }
    }
    handlDisikeSong = async () => {
        let user = JSON.parse(localStorage.getItem('user'))
        let response = await deleteLikedSong({
            idUser: user.id,
            idSong: this.state.idSong
        })
        if (response && response.data.err === 0) {
            this.setState({
                heart: false
            })
        }
    }

    render() {
        let { linkPlaySong, detailSong } = this.state

        return (
            <>
                <div className="player-music-container">
                    {detailSong && <>
                        <div className="info-song">
                            <div className="avatar-song">
                                <img src={detailSong.thumbnail} alt="avatar-song" />
                            </div>
                            <div className="name-song">
                                <div className="name">{detailSong.title}</div>
                                <div className="author-song">{detailSong.artistsNames}</div>
                            </div>
                            <div className="add-libra">
                                {this.state.heart
                                    ? <i title="Bỏ thích bài hát này" onClick={() => this.handlDisikeSong()} className="fa-solid icon fa-heart"></i>
                                    : <i onClick={() => this.handleLikeSong()} title="Yêu thích bài hát này" className="fa-regular fa-heart"></i>}

                            </div>
                        </div>
                        <div className="player">
                            <div className="buttons-player">
                                <i
                                    onClick={() => {
                                        if (this.props.type === 4) {
                                            this.props.handleCustomPlay(this.props.album)
                                        }
                                    }}
                                    title="Bật phát ngẫu nhiên"
                                    className={
                                        this.props.type === 1 ? "fa-solid disabled fa-shuffle" : "fa-solid fa-shuffle"
                                    }
                                ></i>
                                <i
                                    onClick={() => this.handlePrevSong()}
                                    className={
                                        this.props.type === 1
                                            ? "fa-solid disabled fa-backward-step"
                                            : this.state.isPrev
                                                ? "fa-solid fa-backward-step"
                                                : "fa-solid disabled fa-backward-step"
                                    }
                                ></i>
                                <span onClick={() => this.playMusic(!this.state.isPlaying)}>
                                    {this.state.isPlaying
                                        ? <i className="fa-solid fa-circle-pause"></i>
                                        : <i className="fa-solid fa-circle-play"></i>}
                                </span>
                                <i
                                    onClick={() => this.handleNextSong()}
                                    className={
                                        this.props.type === 1
                                            ? "fa-solid disabled fa-forward-step"
                                            : this.state.isNext
                                                ? "fa-solid fa-forward-step"
                                                : "fa-solid disabled fa-forward-step"
                                    }
                                ></i>
                                <i
                                    title="Bật lại phát tất cả"
                                    onClick={() => this.handleStartAgain()}
                                    className={
                                        this.props.type === 1 ? "fa-solid disabled fa-repeat" : "fa-solid fa-repeat"
                                    }
                                ></i>
                            </div>
                            <div className="wrap-progressbar">
                                <span className="time-start">{this.formatTimeMusic(this.state.currentTimeSong)}</span>
                                <div onClick={event => this.handleOnClickProgressBar(event)} className="progress-bar">
                                    <div className="elapse"></div>
                                </div>
                                <span className="time-end">{this.formatTimeMusic(detailSong.duration)}</span>
                            </div>
                        </div>
                    </>}
                    <div className="volumn">
                        <span onClick={() => this.ToggleMute()}>
                            {this.state.currentVolume === 0 ? (
                                <i className="fa-solid fa-volume-xmark"></i>
                            ) : this.state.currentVolume <= 50 ? (
                                <i className="fa-solid fa-volume-low"></i>
                            ) : (
                                <i className="fa-solid fa-volume-high"></i>
                            )}
                        </span>
                        <div onClick={event => this.handleOnChangeVolume(event)} className="line-volume">
                            <div className="elapse-volume"></div>
                        </div>
                    </div>
                </div>
                {this.state.isLoading && <Loading2 />}
            </>
        )
    }
}
const mapStateToProps = state => {
    return {
        isPlayingRedux: state.isPlaying
    }
}

const mapDispatchToProps = dispatch => {
    return {
        playPlayer: () => dispatch(actions.playPlayer()),
        pausePlayer: () => dispatch(actions.pausePlayer())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlayerMusic2))
