import './Login.scss';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { trim } from 'lodash';
// import * as actions from '../../store/actions'
import Swal from 'sweetalert2';
import { handleSignUpService, handleLoginService } from '../../services/userService'
import { withRouter } from 'react-router';
import * as actions from '../../store/actions'
import { Buffer } from 'buffer'
import Loading2 from '../Loading2/Loading2';



class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLogin: true,
            name: '',
            email: '',
            password: '',
            isLoading: false
        }
    }
    handleToggleShowLogin = () => {
        const coverEl = document.querySelector('.cover-box')
        coverEl.classList.remove('start')
        let rectCover = coverEl.getBoundingClientRect()
        if (this.state.isLogin) {
            coverEl.style.cssText = `
                border-top-right-radius: 10px;
                border-bottom-right-radius: 10px;
                transform: translateX(${rectCover.width}px) rotateZ(720deg);
            `
            this.setState({
                isLogin: false,
                name: '',
                email: '',
                password: ''
            })
        } else {
            coverEl.style.cssText = `
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;
                transform: translateX(0) rotateZ(0);

            `
            this.setState({
                isLogin: true,
                name: '',
                email: '',
                password: ''
            })
        }
    }
    handleOnChangeInput = (event, id) => {
        this.setState({
            [id]: event.target.value
        })
    }
    handleSubmitLogin = async () => {
        let resultValidateFields = this.validateFields(['email', 'password'])
        if (!resultValidateFields[0]) {
            Swal.fire({
                title: "Oops!",
                text: "Email nhập vào không đúng!",
                icon: "warning",
                confirmButtonText: "Thử lại"
            })
        } else if (resultValidateFields[1]) {
            Swal.fire({
                title: "Oops!",
                text: `${resultValidateFields[1]} is missing...`,
                icon: "warning",
                confirmButtonText: "Tôi biết rồi"
            })
        } else {
            this.setState({ isLoading: true })
            let response = await handleLoginService({
                email: this.state.email,
                password: this.state.password,
            })
            if (response) this.setState({ isLoading: false })
            if (response && response.data.err === 0) {
                let img = response.data.user.image ? new Buffer(response.data.user.image, 'base64').toString('binary') : ''
                localStorage.setItem('user', JSON.stringify({ ...response.data.user, image: img }))
                this.props.login(true)
                this.props.history.push('/home')
                this.setState({
                    name: '',
                    email: '',
                    password: ''
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
    }
    handleSubmitSignup = async () => {
        let resultValidateFields = this.validateFields(['email', 'password', 'name'])
        if (!resultValidateFields[0]) {
            Swal.fire({
                title: "Oops!",
                text: "Email nhập vào không đúng!",
                icon: "warning",
                confirmButtonText: "Thử lại"
            })
        } else if (resultValidateFields[1]) {
            Swal.fire({
                title: "Oops!",
                text: `${resultValidateFields[1]} is missing...`,
                icon: "warning",
                confirmButtonText: "Tôi biết rồi"
            })
        } else {
            this.setState({ isLoading: true })
            let response = await handleSignUpService({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name
            })
            if (response) this.setState({ isLoading: false })
            if (response && response.data.err === 0) {
                Swal.fire({
                    title: "Congratulation!",
                    text: `Đăng kí tài khoản thành công!`,
                    icon: "success",
                    confirmButtonText: "Đi tới đăng nhập nào!"
                })
                this.setState({
                    name: '',
                    email: '',
                    password: ''
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
    }
    validateFields = (arrField) => {
        return [/\S+@\S+\.\S+/.test(this.state.email), arrField.find(item => trim(this.state[item]) === '')]
    }
    handleEnterSubmit = (event) => {
        if (event.code === 'Enter') {
            this.handleSubmitLogin()
            // console.log(event);
        }
    }
    render() {
        // console.log(this.props);
        return (
            <Fragment>
                <div className='login-container'>
                    <div className='box-login'>
                        <div className="login">
                            <h2 className='title'>Login</h2>
                            <div className="form-input">
                                <label htmlFor="email">Email: </label>
                                <input
                                    onKeyUp={(event) => this.handleEnterSubmit(event)}
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                    type="text" id="email" className='email' />
                            </div>
                            <div className="form-input">
                                <label htmlFor="password">Password: </label>
                                <input
                                    onKeyUp={(event) => this.handleEnterSubmit(event)}
                                    value={this.state.password}
                                    onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                    type="password" id="password" className='password' />
                            </div>
                            <button onClick={() => this.handleSubmitLogin()} type='button' className='btn-submit'>Đăng nhập</button>
                        </div>
                        <div className="sign-up">
                            <h2 className='title'>Đăng ký tài khoản</h2>
                            <div className="form-input">
                                <label htmlFor="email2">Email: </label>
                                <input value={this.state.email} onChange={(event) => this.handleOnChangeInput(event, 'email')} type="text" id="email2" className='email' />
                            </div>
                            <div className="form-input">
                                <label htmlFor="password2">Password: </label>
                                <input value={this.state.password} onChange={(event) => this.handleOnChangeInput(event, 'password')} type="password" id="password2" className='password' />
                            </div>
                            <div className="form-input">
                                <label htmlFor="name">Họ và tên: </label>
                                <input value={this.state.name} onChange={(event) => this.handleOnChangeInput(event, 'name')} type="text" id="name" className='name' />
                            </div>
                            <button type='button' onClick={() => this.handleSubmitSignup()} className='btn-submit'>Đăng ký</button>
                        </div>
                        <div className="cover-box start">
                            <h2 className='title'>{!this.state.isLogin ? 'Hey, bro ~' : 'Hey, welcome back ~'}</h2>
                            <div className="welcome">{!this.state.isLogin ? 'Nếu bro chưa có tài khoản hãy đăng ký nào !' : 'Hãy đăng nhập nào !'}</div>
                            <div onClick={() => this.handleToggleShowLogin()} className="btn-transform">{!this.state.isLogin ? 'Đăng ký' : 'Đăng nhập'}</div>
                        </div>
                    </div>
                </div>
                {this.state.isLoading && <Loading2 />}
            </Fragment>
        )
    }
}
const mapStateToProps = state => {
    return {
        isLoggedIn: state.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        login: (status) => dispatch(actions.login(status))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
