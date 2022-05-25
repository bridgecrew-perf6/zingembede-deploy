import "./Search.scss"
import React, { Component } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import * as actions from "../../store/actions"
import { convertToBase64 } from '../../ulties/convertToBase64'
import { handleUpdateUser, handleGetUser, handleLoginService, changePassword } from '../../services/userService'
import { Buffer } from 'buffer'
import Swal from "sweetalert2"
import { trim } from 'lodash'
import Loading2 from '../Loading2/Loading2'



class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isHome: false,
            keyword: "",
            isShowPopup: false,
            email: '',
            name: '',
            image: '',
            imgBuffer: '',
            email2: '',
            password: '',
            isShowModalEdit: false,
            isChangePassword: false,
            newPassword: '',
            newPassword2: '',
            step: 1,
            message: '',
            invalidField: null,
            isLoading: false
        }
    }
    //check history
    async componentDidMount() {
        if (this.props.history.location.pathname !== "/home") {
            this.setState({
                isHome: true,
            })
        }
        if (localStorage.getItem('user')) {
            this.props.login(true)
            let user = JSON.parse(localStorage.getItem('user'))
            this.setState({
                email: user.email,
                name: user.name,
            })
            let response = await handleGetUser(user.email)
            if (response && response.data.err === 0) {
                this.setState({
                    image: response.data.user.image ? new Buffer(response.data.user.image, 'base64').toString('binary') : 'https://i.pinimg.com/originals/3e/02/a5/3e02a58132717af979963f14d5109d80.jpg',
                })
            }
        }
    }
    async componentDidUpdate(prevProps) {
        if (prevProps.isLoggedIn !== this.props.isLoggedIn) {
            if (localStorage.getItem('user')) {
                this.props.login(true)
                let user = JSON.parse(localStorage.getItem('user'))
                this.setState({
                    email: user.email,
                    name: user.name,
                })
                let response = await handleGetUser(user.email)
                if (response && response.data.err === 0) {
                    this.setState({
                        image: response.data.user.image ? new Buffer(response.data.user.image, 'base64').toString('binary') : 'https://i.pinimg.com/originals/3e/02/a5/3e02a58132717af979963f14d5109d80.jpg',
                    })
                }
            }
        }
    }
    handleOnChangeSearch = event => {
        this.setState({ keyword: event.target.value })
    }
    handleFormatKeyword = keyword => {
        this.props.saveKeyword(keyword)
        return keyword
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .split(" ")
            .join("-")
    }
    handleSubmitSearch = event => {
        if (event.code === "Enter") {
            this.props.history.push(`/detail-search/${this.handleFormatKeyword(this.state.keyword)}`)
            this.setState({ keyword: "" })
        }
    }
    handleToggleLogin = () => {
        if (!this.props.isLoggedIn) {
            this.props.history.push('/login')
        }
    }
    handleGoBack = () => {
        if (this.props.history.location.pathname !== "/home") {
            this.props.history.goBack()
        }
    }
    Toggle = async (id, event, isBox) => {
        if (event)
            event.stopPropagation()
        if (id !== 'isShowPopup' && this.state.isShowPopup) {
            this.setState({
                isShowPopup: !this.state.isShowPopup
            })
        }
        if (id === 'isShowModalEdit' && !this.state.isShowModalEdit) {
            this.props.toggleModal(true)
            if (localStorage.getItem('user')) {
                let user = JSON.parse(localStorage.getItem('user'))
                this.setState({ isLoading: true })
                let response = await handleGetUser(user.email)
                if (response) this.setState({ isLoading: false })
                if (response && response.data.err === 0) {
                    this.setState({
                        message: '',
                        invalidField: null,
                        email: response.data.user.email,
                        name: response.data.user.name,
                        image: response.data.user.image ? new Buffer(response.data.user.image, 'base64').toString('binary') : 'https://i.pinimg.com/originals/3e/02/a5/3e02a58132717af979963f14d5109d80.jpg',
                    }, () => {
                        localStorage.setItem('user', JSON.stringify({
                            email: this.state.email,
                            name: this.state.name,
                            id: response.data.user.id
                        }))
                    })
                }
            }
        }
        if (id === "isChangePassword" && !this.state.isChangePassword) {
            this.setState({
                email2: '',
                password: '',
                message: '',
                invalidField: ''
            })
        }
        if (isBox) {
            if (id === 'isShowModalEdit') {
                this.setState({
                    isShowModalEdit: true
                })
            }
            if (id === 'isChangePassword')
                this.setState({
                    isChangePassword: true
                })
        } else {
            this.setState({
                [id]: !this.state[id]
            }, () => {
                if (id === "isChangePassword" && !this.state.isChangePassword) {
                    this.setState({
                        step: 1
                    })
                }
                if (id === 'isShowModalEdit' && !this.state.isShowModalEdit) {
                    this.props.toggleModal(false)
                }
            })
        }
    }
    handleLogout = () => {
        this.props.login(false)
        this.setState({ isShowPopup: false })
        localStorage.removeItem('user')
        this.props.history.push('/login')
    }
    handleOnChangeInput = (event, id) => {
        this.setState({
            [id]: event.target.value
        })
    }
    handleOnchangeFile = async (event) => {
        let imgbase64 = await convertToBase64(event.target.files[0])
        this.setState({
            image: imgbase64,
        })
    }
    handleSubmitUpdate = async (flag) => {
        if (!flag) {
            let { email, name, image } = this.state
            let payloadUpdate = { email, name, image }
            this.setState({ isLoading: true })
            let response = await handleUpdateUser(payloadUpdate)
            if (response) this.setState({ isLoading: false })
            if (response && response.data.err === 0) {
                localStorage.setItem('user', JSON.stringify({
                    email: this.state.email,
                    name: this.state.name,
                    id: response.data.idUser
                }))
                Swal.fire({
                    title: "Done ~",
                    text: `Cập nhật thông tin thành công !`,
                    icon: "success",
                    confirmButtonText: "Tôi biết rồi"
                })
                this.setState({
                    isShowModalEdit: false,
                    isShowPopup: false,
                })
            }
        }
    }
    handleChangePassword = async () => {
        let { newPassword, newPassword2, email } = this.state

        if (newPassword !== newPassword2) {
            this.setState({
                invalidField: 'newPassword',
                message: 'Mật khẩu không khớp'
            })
        } else {
            this.setState({ isLoading: true })
            let response = await changePassword({
                email, password: newPassword
            })
            if (response) this.setState({ isLoading: false })
            if (response && response.data.err === 0) {
                this.setState({
                    email: null,
                    newPassword: null,
                    newPassword2: null,
                    isChangePassword: false,
                })
                Swal.fire({
                    title: "Hey, bro!",
                    text: `Thay đổi mật khẩu thành công ~`,
                    icon: "success",
                    confirmButtonText: "Đi tới đăng nhập",
                }).then(() => {
                    this.props.history.push('/login')
                })
            }
        }
    }
    handleNextStep = async () => {
        if (this.state.step === 1) {
            let check = this.validateFields(['email2', 'password'])
            if (check[1]) {
                this.setState({
                    invalidField: check[1],
                    message: `${check[1]} is missing...`
                })
            } else if (!check[0]) {
                this.setState({
                    invalidField: 'email2',
                    message: 'Email không hợp lệ'
                })
            } else {
                if (this.state.email === this.state.email2) {
                    this.setState({ isLoading: true })
                    let response = await handleLoginService({ email: this.state.email2, password: this.state.password })
                    if (response) this.setState({ isLoading: false })
                    if (response && response.data.err === 0) {
                        if (this.state.step < 2) {
                            this.setState({
                                step: this.state.step + 1,
                                invalidField: null,
                                message: null,
                            })
                        }
                    } else {
                        this.setState({
                            invalidField: 'password',
                            message: response.data.msg,
                        })
                    }
                } else {
                    this.setState({
                        invalidField: 'email2',
                        message: 'Email không đúng'
                    })
                }

            }


        }

    }
    validateFields = (arrField) => {
        return [/\S+@\S+\.\S+/.test(this.state.email2), arrField.find(item => trim(this.state[item]) === '')]
    }
    handleOnFocus = () => {
        this.setState({
            invalidField: null,
            message: null
        })
    }

    render() {

        return (
            <>
                {this.state.isLoading && <Loading2 />}
                <div className="search-containers">
                    <div className="left-search">
                        <div className="negative">
                            <span onClick={() => this.handleGoBack()}>
                                <i
                                    className={
                                        this.props.history.location.pathname === "/home"
                                            ? "fa-solid fa-arrow-left-long"
                                            : "fa-solid opty-1 fa-arrow-left-long"
                                    }
                                ></i>
                            </span>
                            <span onClick={() => this.props.history.goForward()}>
                                <i
                                    className={
                                        this.props.history.location.pathname === "/home"
                                            ? "fa-solid opty-1 fa-arrow-right-long"
                                            : "fa-solid fa-arrow-right-long"
                                    }
                                ></i>
                            </span>
                        </div>
                        <div className="box-search">
                            <input
                                value={this.state.keyword}
                                onChange={event => this.handleOnChangeSearch(event)}
                                onKeyDown={event => this.handleSubmitSearch(event)}
                                type="text"
                                className="input-search"
                                placeholder="Nhập tên bài hát, nghệ sĩ hoặc MV..."
                            />
                        </div>
                    </div>
                    <div className="account">
                        <span onClick={() => this.handleToggleLogin()}>{this.props.isLoggedIn ? `Xin chào ${this.state.name} ~` : 'Đăng nhập nào!'}</span>
                        {this.props.isLoggedIn && <div onClick={() => this.Toggle('isShowPopup')} className="wrap-img-account">
                            <img
                                src={this.state.image ? this.state.image : 'https://i.pinimg.com/originals/3e/02/a5/3e02a58132717af979963f14d5109d80.jpg'}
                                alt="avatar"
                            />
                        </div>}
                        {this.state.isShowPopup && this.props.isLoggedIn && <div className="pop-up-account">
                            <div onClick={() => this.Toggle('isShowModalEdit')} className="item">Chỉnh sửa thông tin cá nhân</div>
                            <div onClick={() => this.Toggle('isChangePassword')} className="item">Thay đổi mật khẩu</div>
                            <div onClick={() => this.handleLogout()} className="item">Đăng xuất</div>
                        </div>}
                        {this.state.isShowModalEdit && <div onClick={() => this.Toggle('isShowModalEdit')} className="edit-info-user-modal">
                            <div onClick={(event) => this.Toggle('isShowModalEdit', event, true)} className="content-modal">
                                <div className="header">Chỉnh sửa thông tin cá nhân</div>
                                <div className="body">
                                    <div className="form-input">
                                        <label htmlFor="email2">Email: </label>
                                        <input readOnly value={this.state.email} onChange={(event) => this.handleOnChangeInput(event, 'email')} type="text" id="email2" className='email' />

                                    </div>
                                    <div className="form-input">
                                        <label htmlFor="password2">Tên gọi: </label>
                                        <input value={this.state.name} onChange={(event) => this.handleOnChangeInput(event, 'name')} type="name" id="password2" className='name' />
                                        <small hidden={this.state.invalidField === 'password' && this.state.message} >{this.state.message}</small>
                                    </div>
                                    <div className="form-input">
                                        <label htmlFor="avatar" className="avatar">Avatar <i className="fa-solid fa-upload"></i></label>
                                        {this.state.image && <input onChange={(event) => this.handleOnchangeFile(event)} hidden={true} type="file" id="avatar" className='name' />}
                                        {this.state.image && <div className="preview"><img src={this.state.image} alt="" /></div>}
                                    </div>
                                    <button type="button" onClick={() => this.handleSubmitUpdate()} className="btn-submit">Cập nhật</button>
                                </div>
                            </div>
                        </div>}
                        {this.state.isChangePassword && <div onClick={() => this.Toggle('isChangePassword')} className="edit-info-user-modal">
                            <div onClick={(event) => this.Toggle('isChangePassword', event, true)} className="content-modal">
                                <div className="header">Thay đổi mật khẩu</div>
                                <div className="body">
                                    <div className="form-input">
                                        <label htmlFor="email2">Email: </label>
                                        <input
                                            value={this.state.email2}
                                            onChange={(event) => this.handleOnChangeInput(event, 'email2')}
                                            placeholder='Xác nhận email...'
                                            type="text" id="email2" className='email'
                                            onFocus={() => this.handleOnFocus()}
                                        />
                                        {this.state.invalidField === 'email2' && <small >{this.state.message}</small>}

                                    </div>
                                    {this.state.step === 1 && <div className="form-input">
                                        <label htmlFor="p3">Mật Khẩu hiện tại: </label>
                                        <input
                                            value={this.state.password}
                                            onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                            type="password" id="p3" className='password'
                                            placeholder='Xác nhận mật khẩu...'
                                            onFocus={() => this.handleOnFocus()}
                                        />
                                        {this.state.invalidField === 'password' && <small >{this.state.message}</small>}
                                    </div>}
                                    {this.state.step === 2 && <> <div className="form-input">
                                        <label htmlFor="p4">Mật Khẩu mới: </label>
                                        <input value={this.state.newPassword} onChange={(event) => this.handleOnChangeInput(event, 'newPassword')} type="password" id="p4" className='newPassword' />
                                    </div>
                                        <div className="form-input">
                                            <label htmlFor="p5">Nhập lại mật Khẩu mới: </label>
                                            <input value={this.state.newPassword2} onChange={(event) => this.handleOnChangeInput(event, 'newPassword2')} type="password" id="p5" className='newPassword2' />
                                            {this.state.invalidField === 'newPassword' && <small >{this.state.message}</small>}
                                        </div></>
                                    }
                                    {this.state.step === 2
                                        ? <button type="button" onClick={() => this.handleChangePassword()} className="btn-submit">Cập nhật</button>
                                        : <button type="button" onClick={() => this.handleNextStep()} className="btn-submit">Tiếp</button>}
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
            </>
        )
    }
}
const mapStateToProps = state => {
    return {
        isLoggedIn: state.isLoggedIn,
        modal: state.modal

    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveKeyword: keyword => dispatch(actions.saveKeyword(keyword)),
        login: (status) => dispatch(actions.login(status)),
        toggleModal: (data) => dispatch(actions.toggleModal(data))
    };
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Search))
