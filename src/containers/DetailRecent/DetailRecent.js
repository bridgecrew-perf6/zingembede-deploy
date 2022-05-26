import './DetailRecent.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { handleGetRecent } from '../../services/userService';
import PlayListWihoutCD from '../PlayListWithoutCD/PlayListWithoutCD';
import * as actions from '../../store/actions'
import Loading2 from '../Loading2/Loading2';
import PlayerMusic2 from '../BoxPlayMusic/PlayerMusic2';






class DetailRecent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataAlbum: null,
            dataSongs: null,
            idSong: null,
            isLoading: false,
            avatarSong: null,
            nameSong: null,
            artist: null,
            duration: null,
            playMusic: false,
            customPlayMode: false
        }
    }
    async componentDidMount() {
        if (localStorage.getItem('user')) {
            this.setState({ isLoading: true })
            let response = await handleGetRecent(JSON.parse(localStorage.getItem('user')).id)
            if (response) this.setState({ isLoading: false })
            if (response && response.data.err === 0) {
                let prevDataSongs = [...response.data.songs]
                this.setState({
                    dataAlbum: response.data.songs.filter(item => item.idAlbum !== 'none')
                        .filter((item, index, self) => index === self.findIndex(item2 => item2.idAlbum === item.idAlbum)), // delete the album duplication
                    dataSongs: prevDataSongs.map(item => {
                        return {
                            encodeId: item.idSong,
                            thumbnail: item.avatarSong,
                            title: item.titleSong,
                            artistsNames: item.artistSong,
                            releaseDate: item.dayRelease,
                            duration: item.duartion
                        }
                    }).reverse(),
                })
            }
        }
    }
    // unmount player when the song hasnot played in this component
    componentDidUpdate(prevProps) {
        if (prevProps.refreshPlayState !== this.props.refreshPlayState) {
            if (this.props.refreshPlayState === '8') {
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
        this.props.refreshPlay('8') //dispatch the signal in order to determine which component is playing the player
        this.setState({
            idSong: item.encodeId,
            playMusic: true,
            artist: item.artistsNames,
            nameSong: item.title,
            avatarSong: item.thumbnail,
            duration: item.duration,
        })
    }
    getCurrentSong = (id) => {
        this.setState({
            idSong: id
        })
    }
    handleCustomPlay = (playlistSong) => {
        if (playlistSong) {
            let randomIndexSong = (Math.random() * (playlistSong.length - 1)).toFixed(0)
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
    render() {
        let { dataSongs, dataAlbum } = this.state

        return (
            <>
                <div className='detail-recent-container'>
                    <div className="title-detail-recent">Nghe gần đây</div>
                    <div className="content-detail-recent">
                        <div className="songs">
                            <div className="playlist">
                                {dataSongs && (
                                    <PlayListWihoutCD
                                        playlist={dataSongs}
                                        idSong={this.state.idSong}
                                        handlePlayMusic={this.handlePlayMusic}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="album">
                            <h3 className='title'>Album nghe gần đây</h3>
                            {dataAlbum && <div className="wrap-album">
                                {dataAlbum && dataAlbum.length > 0 && dataAlbum.map((item, index) => {
                                    return (
                                        <div key={index} onClick={() => this.handleDetailAlbum(index, item)} className="box-avatar">
                                            <div className="wrap-img">
                                                <img src={item.avatarAlbum} alt="avatar" />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>}
                        </div>
                    </div>
                </div>
                {this.state.isLoading && <Loading2 />}
                {this.state.playMusic && <PlayerMusic2
                    idSong={this.state.idSong}
                    type={4}
                    album={this.state.dataSongs}
                    avatarSong={this.state.avatarSong}
                    nameSong={this.state.nameSong}
                    artist={this.state.artist}
                    duration={this.state.duration}
                    getCurrentSong={this.getCurrentSong}
                    handleCustomPlay={this.handleCustomPlay}
                    customPlayMode={this.state.customPlayMode}
                />}
            </>
        )
    }
}
const mapStateToProps = state => {
    return {
        refreshPlayState: state.refreshPlay
    };
};

const mapDispatchToProps = dispatch => {
    return {
        refreshPlay: (id) => dispatch(actions.refreshPlay(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailRecent);
