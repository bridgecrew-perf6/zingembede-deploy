import "./LeftSidebar.scss"
import React, { Component } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router"
import { handleCreateNewPlaylist } from '../../services/userService'
import Swal from "sweetalert2"
import Loading2 from "../Loading2/Loading2"


class LeftSidebar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentTab: this.props.history.location.pathname,
            isShowModal: false,
            namePlaylist: null,
            isLoading: false
        }
    }
    componentDidUpdate() {
        if (this.state.currentTab !== this.props.history.location.pathname) {
            this.setState({ currentTab: this.props.history.location.pathname })
        }
    }

    redirect = path => {
        if (path === "/personal") {
            let user = JSON.parse(localStorage.getItem('user'))
            if (!user || !user.email) {
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
            } else {
                this.props.history.push(path)
                this.setState({ currentTab: path })
            }
        } else {
            this.props.history.push(path)
            this.setState({ currentTab: path })
        }
    }
    toggleModal = (signal, event) => {
        if (event) event.stopPropagation()
        this.setState({
            isShowModal: signal
        })
    }
    handleOnchange = (event) => {
        this.setState({
            namePlaylist: event.target.value
        })
    }
    handleRedirect = async (event) => {
        event.stopPropagation()
        let user = JSON.parse(localStorage.getItem('user'))
        if (user && user.email) {
            let idPlaylist = (Math.random() + 1).toString(36).substring(2)
            this.setState({ isLoading: true })
            let response = await handleCreateNewPlaylist({
                idUser: JSON.parse(localStorage.getItem('user')).id,
                idPlaylist: idPlaylist,
                namePlaylist: this.state.namePlaylist || 'Chưa đặt tên'
            })
            if (response) this.setState({ isLoading: false })
            if (response && response.data.err === 0) {
                this.props.history.push(`/detail-playlist/${idPlaylist}`)
                this.setState({
                    isShowModal: false
                })
            } else {
                Swal.fire({
                    title: "Oops!",
                    text: `Đã có lỗi gì đó, thử lại nào ~`,
                    icon: "warning",
                    confirmButtonText: "Tôi biết rồi"
                })
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

        return (
            <>
                <div className="left-sidebar-container">
                    <div onClick={() => this.redirect("/home")} className="logo">
                        <span>Zing</span> <span>em</span> <span>bê</span> <span>đê</span>
                    </div>
                    <div className="logo-v2">
                        <img src="https://zjs.zmdcdn.me/zmp3-desktop/releases/v1.6.27/static/media/icon_zing_mp3_60.f6b51045.svg" alt="" />
                    </div>
                    <div className="section-one">
                        <div
                            onClick={() => this.redirect("/personal")}
                            className={this.state.currentTab === "/personal" ? "item selected" : "item"}
                        >
                            <i title="Cá nhân" className="fa-solid fa-headphones-simple"></i><span>Cá nhân</span>
                        </div>
                        <div
                            onClick={() => this.redirect("/home")}
                            className={this.state.currentTab === "/home" ? "item selected" : "item"}
                        >
                            <i title="Khám phá" className="fa-solid fa-compact-disc"></i><span>Khám phá</span>
                        </div>
                        <div
                            onClick={() => this.redirect("/detail-chart")}
                            className={this.state.currentTab === "/detail-chart" ? "item selected" : "item"}
                        >
                            <i title="#zingchart" className="fa-solid fa-chart-line"></i><span>#zingchart</span>
                        </div>
                        <div
                            onClick={() => this.redirect("/new-release")}
                            className={this.state.currentTab === "/new-release" ? "item selected" : "item"}
                        >
                            <i title="Nhạc mới" className="fa-solid fa-music"></i><span>Nhạc mới</span>
                        </div>
                        <div
                            onClick={() => this.redirect("/detail-top-100")}
                            className={this.state.currentTab === "/detail-top-100" ? "item selected" : "item"}
                        >
                            <i title="Top 100" className="fa-regular fa-star"></i><span>Top 100</span>
                        </div>
                        <div
                            onClick={() => this.redirect("/detail-recent")}
                            className={this.state.currentTab === "/detail-recent" ? "item selected" : "item"}
                        >
                            <i title="Gần đây" className="fa-regular fa-clipboard"></i><span>Gần đây</span>
                        </div>
                    </div>
                    <div title="Tạo playlist mới" onClick={() => this.toggleModal(true)} className="create-new-playlist"><i className="fa-regular fa-square-plus"></i> <span>Tạo playlist mới</span></div>
                    {this.state.isShowModal && <div onClick={() => this.toggleModal(false)} className="pop-up-new-playlist">
                        <div onClick={(event) => this.toggleModal(true, event)} className="box-pop-up">
                            <h3>Tạo playlist mới</h3>
                            <input onChange={(event) => this.handleOnchange(event)} type="text" placeholder="Đặt tên playlist..." />
                            <button
                                onClick={(event) => this.handleRedirect(event)}
                                className="btn-create-new"
                            >
                                Tạo mới
                            </button>
                        </div>
                    </div>}
                    <div className="box-vip">
                        Nghe nhạc không quảng cáo cùng kho nhạc VIP
                        <div className="buy-vip">Nâng cấp VIP</div>
                    </div>
                </div>
                {this.state.isLoading && <Loading2 />}
            </>
        )
    }
}
const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = dispatch => {
    return {}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LeftSidebar))
