import './Personal.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { handlePersonal, handleGetNewPlaylist } from '../../services/userService'
import { withRouter } from 'react-router';
import Loading2 from '../Loading2/Loading2';




class Personal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mySingers: null,
            mySingersFull: null,
            singers: null,
            singerFull: false,
            myAlbum: null,
            myAlbumFull: null,
            album: null,
            albumFull: false,
            dataPlayplist: null,
            isLoading: false
        }
    }

    async componentDidMount() {
        let idUser = JSON.parse(localStorage.getItem('user')).id
        this.setState({ isLoading: true })
        let [response, resPlaylist] = await Promise.all([handlePersonal(idUser), handleGetNewPlaylist(idUser)])
        if (response) this.setState({ isLoading: false })
        if (resPlaylist && resPlaylist.data.err === 0) {
            this.setState({
                dataPlayplist: resPlaylist.data.playlist
            })
        }

        if (response && response[0] && response[0].data.err === 0) {
            let singerFull = [...response[0].data.response]
            if (response[0].data.response && response[0].data.response.length > 6)
                response[0].data.response.length = 6
            this.setState({
                mySingers: response[0].data.response,
                mySingersFull: singerFull,
                singers: response[0].data.response
            })
        }
        if (response && response[1] && response[1].data.err === 0) {
            let albumFull = [...response[1].data.response]
            if (response[1].data.response && response[1].data.response.length > 5)
                response[1].data.response.length = 5
            this.setState({
                myAlbum: response[1].data.response,
                myAlbumFull: albumFull,
                album: response[1].data.response
            })
        }
    }
    handleDetailSinger = (index, item) => {
        if (index === 5 && this.state.mySingersFull.length > 6 && !this.state.singerFull) {
            this.setState({
                singers: this.state.mySingersFull,
                singerFull: true

            })
        } else {
            this.props.history.push(`/detail-singer/${item.idSinger}`)
        }
    }
    handleDetailAlbum = (index, item) => {
        if (index === 4 && this.state.myAlbumFull.length > 5 && !this.state.albumFull) {
            this.setState({
                album: this.state.myAlbumFull,
                albumFull: true
            })
        } else {
            this.props.history.push(`/detail-album/${item.idAlbum}`)
        }
    }
    render() {
        let { singers, album, dataPlayplist } = this.state
        // console.log(this.state.dataPlayplist);
        return (
            <>
                <div className='personal-container'>
                    <div className="content-personal">
                        <h3 className='title'>Ca sĩ yêu thích</h3>
                        {singers ? <div className="wrap-singer">
                            {singers && singers.length > 0 && singers.map((item, index) => {
                                return (
                                    <div key={index} onClick={() => this.handleDetailSinger(index, item)} className="box-avatar">
                                        <div className="wrap-img">
                                            <img src={item.avatar} alt="avatar" className={!this.state.singerFull ? 'actived' : ''} />
                                            {!this.state.singerFull && index === 5 && <span className='all'>{`+${this.state.mySingersFull.length - this.state.mySingers.length}`}</span>}
                                        </div>
                                        <small className='name'>{item.name}</small>
                                    </div>
                                )
                            })}
                        </div> : <span>Bạn chưa có ca sĩ yêu thích nào ~</span>}
                        <h3 className='title'>Album yêu thích</h3>
                        {album ? <div className="wrap-album">
                            {album && album.length > 0 && album.map((item, index) => {
                                return (
                                    <div key={index} onClick={() => this.handleDetailAlbum(index, item)} className="box-avatar">
                                        <div className="wrap-img">
                                            <img src={item.avatar} alt="avatar" className={!this.state.albumFull ? 'actived' : ''} />
                                            {!this.state.albumFull && index === 4 && <span className='all'>{`+${this.state.myAlbumFull.length - this.state.myAlbum.length}`}</span>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div> : <span>Bạn chưa có album yêu thích nào ~</span>}
                        <h3 className='title'>Playlist</h3>
                        {dataPlayplist ? <div className="wrap-album">
                            {dataPlayplist && dataPlayplist.length > 0 && dataPlayplist.map((item, index) => {
                                return (
                                    <div key={index} onClick={() => this.props.history.push(`/detail-playlist/${item.idPlaylist}`)} className="box-avatar">
                                        <div className="wrap-img">
                                            <img src='https://raw.githubusercontent.com/hip06/strore-image/master/note.png' alt="avatar" />
                                        </div>
                                        <div className="name">{item.namePlaylist}</div>
                                    </div>
                                )
                            })}
                        </div> : <span>Bạn chưa có Playplist yêu thích nào ~</span>}
                    </div>
                </div>
                {this.state.isLoading && <Loading2 />}
            </>
        )
    }
}
const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Personal));
