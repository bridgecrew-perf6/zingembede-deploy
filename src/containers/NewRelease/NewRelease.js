import './NewRelease.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Scrollbars } from "react-custom-scrollbars"
import PlayListWithoutCD from '../PlayListWithoutCD/PlayListWithoutCD';
import PlayerMusic2 from '../BoxPlayMusic/PlayerMusic2';
import { getNewRelease } from '../../services/userService'
import * as actions from '../../store/actions'
import Loading2 from '../Loading2/Loading2';





class NewRelease extends Component {
    constructor(props) {
        super(props)
        this.state = {
            playlist: null,
            idSong: null,
            playMusic: false,
            customPlayMode: false,
            isLoading: false,
            avatarSong: null,
            nameSong: null,
            artist: null,
            duration: null,
        }
    }
    async componentDidMount() {
        this.setState({ isLoading: true })
        let response = await getNewRelease()
        if (response) this.setState({ isLoading: false })
        if (response && response.data.err === 0) {
            this.setState({
                playlist: response.data.data.items
            })
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.refreshPlayState !== this.props.refreshPlayState) {
            if (this.props.refreshPlayState === '7') {
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
    handlePlayMusic = (item) => {
        this.props.refreshPlay('7')
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
    render() {
        let { playlist } = this.state
        return (
            <>
                <div className='new-release-container'>
                    <div className="bg">
                        <img src="https://zjs.zmdcdn.me/zmp3-desktop/releases/v1.6.25/static/media/new-release-bg.73d8f976.jpg" alt="" />
                    </div>
                    <div className="bg-color"></div>
                    <div className="content-new-release">
                        <h3 className='title'>Mới phát hành</h3>
                        <Scrollbars style={{ width: '100%', height: '65vh' }}
                            renderThumbVertical={props => <div {...props} className="thumb-vertical" />}
                        >
                            <div className="songs">
                                {playlist && <PlayListWithoutCD
                                    playlist={playlist}
                                    idSong={this.state.idSong}
                                    handlePlayMusic={this.handlePlayMusic}
                                    rank={true}
                                />}
                            </div>
                        </Scrollbars>
                    </div>
                </div>
                {this.state.playMusic && <PlayerMusic2
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
                />}
                {this.state.isLoading && <Loading2 />}
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

export default connect(mapStateToProps, mapDispatchToProps)(NewRelease);
