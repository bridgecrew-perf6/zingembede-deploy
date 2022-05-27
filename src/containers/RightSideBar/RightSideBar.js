import './RightSideBar.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { handleGetRecent, handleDeleteRecent } from '../../services/userService'
import PlayerMusic2 from '../BoxPlayMusic/PlayerMusic2'
import * as actions from '../../store/actions'






class RightSideBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataRecent: null,
            idSong: null,
            playMusic: false,
            avatarSong: null,
            nameSong: null,
            artist: null,
            duration: null,
        }
    }
    async componentDidMount() {
        if (localStorage.getItem('user')) {
            let response = await handleGetRecent(JSON.parse(localStorage.getItem('user')).id)
            if (response && response.data.err === 0) {
                if (response.data.songs.length > 20) await handleDeleteRecent(JSON.parse(localStorage.getItem('user')).id)
                this.setState({
                    dataRecent: response.data.songs.reverse()
                })
            } else {
                this.setState({
                    dataRecent: null
                })
            }
        }
    }
    async componentDidUpdate(prevProps) {
        if ((prevProps.updateRecent !== this.props.updateRecent) || (prevProps.isLoggedIn !== this.props.isLoggedIn)) {
            if (localStorage.getItem('user')) {
                let response = await handleGetRecent(JSON.parse(localStorage.getItem('user')).id)
                if (response && response.data.err === 0) {
                    if (response.data.songs.length > 20) await handleDeleteRecent(JSON.parse(localStorage.getItem('user')).id)
                    this.setState({
                        dataRecent: response.data.songs.reverse()
                    })
                }
            } else {
                this.setState({
                    dataRecent: null
                })
            }
        }
        if (prevProps.refreshPlayState !== this.props.refreshPlayState) {
            if (this.props.refreshPlayState === '0') {
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
        this.props.refreshPlay('0')
        this.setState({
            idSong: item.idSong,
            playMusic: true,
            artist: item.artistSong,
            nameSong: item.titleSong,
            avatarSong: item.avatarSong,
            duration: item.duartion,
        })
    }
    render() {
        let { dataRecent, idSong } = this.state
        if (dataRecent) {
            dataRecent.length = 10
        }

        return (
            <>
                <div className='right-sidebar-container'>
                    <h4 className='recent-title'>Nghe gần đây</h4>
                    <div className="recent-content">
                        {dataRecent && dataRecent[0] !== undefined
                            ? <div className="content">
                                {dataRecent.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => this.handlePlayMusic(item)}
                                            className={idSong === item.idSong ? "box-song selected-song" : "box-song"}>
                                            <div className="wrap-img-song">
                                                <div className="box-img"><img src={item.avatarSong} alt="img" /></div>
                                                <div className="info-song">
                                                    <div className="title-song">{item.titleSong}</div>
                                                    <div className="artist-song opty-5">{item.artistSong}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            : <div className="no-data">Chưa có bài hát nào ~</div>}
                    </div>
                </div>
                {this.state.playMusic && <PlayerMusic2
                    type={1}
                    idSong={this.state.idSong}
                    avatarSong={this.state.avatarSong}
                    nameSong={this.state.nameSong}
                    artist={this.state.artist}
                    duration={this.state.duration}
                />}
            </>
        )
    }
}
const mapStateToProps = state => {
    return {
        updateRecent: state.updateRecent,
        refreshPlayState: state.refreshPlay,
        isLoggedIn: state.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        refreshPlay: (id) => dispatch(actions.refreshPlay(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RightSideBar);
