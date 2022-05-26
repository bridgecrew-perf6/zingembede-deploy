import "./DetailSinger.scss"
import React, { Component } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import { getDetailSinger, getDetailPlaylistByIdService, handleAddFavoriteSong, handlePersonal, handleDeleteLike } from "../../services/userService"
import { Scrollbars } from "react-custom-scrollbars"
import * as actions from '../../store/actions'
import PlayListWithoutCD from "../PlayListWithoutCD/PlayListWithoutCD"
import PlayerMusic2 from "../BoxPlayMusic/PlayerMusic2"
import BoxSlider from "../BoxSlider/BoxSlider"
import NoData from "./NoData/NoData"
import ModalDetailInfomation from "./ModalDetailInfomation/ModalDetailInfomation"
import SingleAndEp from "./SingleAndEp/SingleAndEp"
import Swal from "sweetalert2"
import Loading2 from "../Loading2/Loading2"

var idInterval = null

class DetailSinger extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataDetailSinger: null,
            selectedTab: null,
            popularSongs: null,
            popularIdSong: null,
            customPlayMode: false,
            playMusic: false,
            singleAndEp: null,
            singleAndEpFull: null,
            album: null,
            collection: null,
            appearIn: null,
            isShowModal: false,
            dataPlaylist: null,
            currentAlbum: null,
            user: null,
            isLiked: false,
            isLoading: false,
            avatarSong: null,
            nameSong: null,
            artist: null,
            duration: null,
        }
    }

    async componentDidMount() {
        let user = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null
        this.setState({ isLoading: true })
        let responseInfoSinger = await getDetailSinger(this.props.match.params.alias)
        if (responseInfoSinger) this.setState({ isLoading: false })
        if (responseInfoSinger && responseInfoSinger.data.err === 0) {
            this.setState(
                {
                    selectedTab: 0,
                    dataDetailSinger: responseInfoSinger.data.data,
                    popularSongs: responseInfoSinger.data.data.sections[0],
                    singleAndEp: responseInfoSinger.data.data.sections[1],
                    singleAndEpFull: [...responseInfoSinger.data.data.sections[1].items],
                    album: responseInfoSinger.data.data.sections[2],
                    collection: responseInfoSinger.data.data.sections[4],
                    appearIn: responseInfoSinger.data.data.sections[5],
                    user: user,

                },
                async () => {
                    if (this.state.singleAndEp) this.state.singleAndEp.items.length = 5
                    this.setState({ isLoading: true })
                    let response = await getDetailPlaylistByIdService(this.state.dataDetailSinger.playlistId)
                    if (response) this.setState({ isLoading: false })
                    if (response && response.data.err === 0) {
                        this.setState({
                            dataPlaylist: response.data.data.song
                        })
                    }
                }
            )
        }
        if (user) {
            let response = await handlePersonal(user.id)
            if (response && response[0] && response[0].data.err === 0) {
                let check = response[0].data.response.find(item => item.idSinger === this.props.match.params.alias) //
                if (check) this.setState({ isLiked: true })
            }
        }



    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedTab !== this.state.selectedTab) {
            clearInterval(idInterval)
            if (this.state.selectedTab === 0) this.handleEffectImg()
        }
        if (prevState.selectedTab !== this.state.selectedTab) {
            switch (this.state.selectedTab) {
                case 0:
                    this.setState({
                        currentAlbum: this.state.popularSongs.items
                    })
                    break
                case 3:
                    this.setState({
                        currentAlbum: this.state.dataPlaylist.items
                    })
                    break
                default:
                    break
            }
        }
        if (prevProps.refreshPlayState !== this.props.refreshPlayState) {
            if (this.props.refreshPlayState === '3') {
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
    componentWillUnmount() {
        clearInterval(idInterval)
    }
    handleActivedTab = index => {
        this.setState({
            selectedTab: index
        })
    }
    handlePlayMusic = item => {
        this.props.refreshPlay('3')
        this.setState({
            idSong: item.encodeId,
            playMusic: true,
            artist: item.artistsNames,
            nameSong: item.title,
            avatarSong: item.thumbnail,
            duration: item.duration,
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
    handleEffectImg = () => {
        const imgEls = document.querySelectorAll(".item-img")
        let currentIndex = imgEls.length - 1
        idInterval = setInterval(() => {
            for (let i = 0; i < imgEls.length; i++) {
                if (i === currentIndex) {
                    if (document.querySelector(".first")) document.querySelector(".first").classList.remove("first")
                    if (document.querySelector(".second")) document.querySelector(".second").classList.remove("second")
                    if (document.querySelector(".three")) document.querySelector(".three").classList.remove("three")
                    if (currentIndex < 0) {
                        imgEls[imgEls.length - 1].classList.add("first")
                    } else {
                        imgEls[i].classList.add("first")
                    }
                    if (currentIndex - 2 < 0) {
                        imgEls[imgEls.length - 1].classList.add("three")
                    } else {
                        imgEls[i - 2].classList.add("three")
                    }
                    if (currentIndex - 1 < 0) {
                        imgEls[imgEls.length - 1].classList.add("second")
                    } else {
                        imgEls[i - 1].classList.add("second")
                    }
                }
            }
            // console.log(currentIndex)
            if (currentIndex === 0) {
                currentIndex = imgEls.length - 1
            } else {
                currentIndex -= 1
            }
        }, 2000)
    }
    handleToggleModal = (event, signal) => {
        event.stopPropagation()
        this.setState({
            isShowModal: signal
        })
    }
    handlePlayAll = () => {
        this.setState({
            idSong: this.state.dataPlaylist.items[0].encodeId,
            playMusic: true
        })
    }
    handleSeeAll = tab => {
        this.setState({ selectedTab: tab })
    }
    handleLike = async () => {
        let { user, dataDetailSinger, isLiked } = this.state
        if (user) {
            if (!isLiked) {
                if (user && dataDetailSinger) {
                    let response = await handleAddFavoriteSong({
                        idUser: user.id,
                        idSinger: dataDetailSinger.alias,
                        name: dataDetailSinger.name,
                        avatar: dataDetailSinger.thumbnail
                    })
                    if (response && response.data.err === 0) {
                        this.setState({
                            isLiked: true
                        })
                    }
                }
            } else {
                let response = await handleDeleteLike({
                    idUser: user.id,
                    idSinger: dataDetailSinger.alias,
                    type: 'singer',
                    idAlbum: 'none'
                })
                if (response && response.data.err === 0) {
                    this.setState({
                        isLiked: false
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
    render() {
        let { dataDetailSinger, popularSongs, selectedTab, singleAndEp, album, collection, appearIn, dataPlaylist } =
            this.state
        let Tabs = ["Tổng quan", "Bài hát", `SINGLE & EP`, "Album", "MV"]

        return (
            <>
                {dataDetailSinger && (
                    <div className="detail-singer-container">
                        <div className="show-profile">
                            <div className="bg-img">
                                <img src={dataDetailSinger.cover} alt="cover" />
                            </div>
                            <div className="info-singer">
                                <div className="left-info">
                                    <div className="name">{dataDetailSinger.name}</div>
                                    <div className="short-description">{`${dataDetailSinger.sortBiography}...`}</div>
                                    <span onClick={event => this.handleToggleModal(event, true)} className="see-more">
                                        Chi tiết
                                    </span>
                                    {this.state.isLiked ? <span onClick={() => this.handleLike()}> <i className="fa-solid fa-circle-check"></i> Đã thích</span> : <span onClick={() => this.handleLike()} className="see-more like">
                                        Yêu thích
                                    </span>}
                                </div>
                                <div className="right-info">
                                    <div className="avatar">
                                        <img src={dataDetailSinger.thumbnail} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="content-singer">
                            <div className="nav-singer">
                                {Tabs.map((item, index) => {
                                    return (
                                        <span
                                            key={index}
                                            onClick={() => this.handleActivedTab(index)}
                                            className={this.state.selectedTab === index ? "item actived" : "item"}
                                        >
                                            {item}
                                        </span>
                                    )
                                })}
                            </div>
                            <div className="content">
                                {selectedTab === 0 && popularSongs && (
                                    <>
                                        <div className="popular-songs">
                                            <div className="title">{popularSongs.title}</div>
                                            <div className="info-section">
                                                <div className="box-img-effect">
                                                    {popularSongs.items &&
                                                        popularSongs.items.map((item, index) => {
                                                            return (
                                                                <img
                                                                    onClick={() => this.handlePlayMusic(item)}
                                                                    key={index}
                                                                    value={index}
                                                                    className="item-img"
                                                                    src={item.thumbnailM}
                                                                    alt="banner"
                                                                />
                                                            )
                                                        })}
                                                </div>
                                                <div className="playlist">
                                                    <Scrollbars
                                                        style={{
                                                            width: "100%",
                                                            height: "300px"
                                                        }}
                                                        renderThumbVertical={props => <div {...props} className="thumb-vertical" />}
                                                    >
                                                        {popularSongs.items && (
                                                            <PlayListWithoutCD
                                                                rank={false}
                                                                playlist={popularSongs.items}
                                                                idSong={this.state.idSong}
                                                                handlePlayMusic={this.handlePlayMusic}
                                                            />
                                                        )}
                                                    </Scrollbars>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="singer-ep">
                                            {singleAndEp && (
                                                <BoxSlider h3={singleAndEp.title} data={singleAndEp.items} />
                                            )}
                                            <small onClick={() => this.handleSeeAll(4)} className="see-all">
                                                TẤT CẢ <i className="fa-solid fa-chevron-right"></i>
                                            </small>
                                        </div>
                                        <div className="album">
                                            {album && <BoxSlider h3={album.title} data={album.items} />}
                                            <small onClick={() => this.handleSeeAll(5)} className="see-all">
                                                TẤT CẢ <i className="fa-solid fa-chevron-right"></i>
                                            </small>
                                        </div>
                                        <div className="collection">
                                            {collection && <BoxSlider h3={collection.title} data={collection.items} />}
                                        </div>
                                        <div className="appear-in">
                                            {appearIn && <BoxSlider h3={appearIn.title} data={appearIn.items} />}
                                        </div>
                                    </>
                                )}
                                {selectedTab === 4 && <NoData />}
                                {selectedTab === 1 && dataPlaylist && (
                                    <div className="songs">
                                        <div className="title">
                                            Danh sách bài hát{" "}
                                            <small onClick={() => this.handlePlayAll()}>
                                                <i className="fa-solid fa-circle-play"></i>Phát tất cả
                                            </small>
                                        </div>
                                        <PlayListWithoutCD
                                            rank={false}
                                            playlist={dataPlaylist.items}
                                            idSong={this.state.idSong}
                                            handlePlayMusic={this.handlePlayMusic}
                                        />
                                    </div>
                                )}
                                {selectedTab === 2 && this.state.singleAndEpFull && (
                                    <div className="single-ep-section"><SingleAndEp singleAndEpFull={this.state.singleAndEpFull} /></div>
                                )}
                                {selectedTab === 3 && this.state.album && (
                                    <div className="album-section"><BoxSlider h3={""} data={this.state.album.items} detail={true} /></div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {this.state.playMusic && (
                    <PlayerMusic2
                        idSong={this.state.idSong}
                        type={4}
                        album={this.state.currentAlbum}
                        getCurrentSong={this.getCurrentSong}
                        handleCustomPlay={this.handleCustomPlay}
                        customPlayMode={this.state.customPlayMode}
                        avatarSong={this.state.avatarSong}
                        nameSong={this.state.nameSong}
                        artist={this.state.artist}
                        duration={this.state.duration}
                    />
                )}
                {this.state.isShowModal && (
                    <ModalDetailInfomation
                        handleToggleModal={this.handleToggleModal}
                        data={this.state.dataDetailSinger}
                    />
                )}
                {this.state.isLoading && <Loading2 />}
            </>
        )
    }
}
const mapStateToProps = state => {
    return {
        refreshPlayState: state.refreshPlay
    }
}

const mapDispatchToProps = dispatch => {
    return {
        refreshPlay: (id) => dispatch(actions.refreshPlay(id))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailSinger))
