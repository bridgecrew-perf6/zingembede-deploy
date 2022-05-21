import './DetailTop100.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getHomepageService } from '../../services/userService'
import { withRouter } from 'react-router';
import Loading2 from '../Loading2/Loading2';





class DetailTop100 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataTop100: null,
            isLoading: false
        }
    }
    async componentDidMount() {
        this.setState({ isLoading: true })
        let response = await getHomepageService('3')
        if (response) this.setState({ isLoading: false })
        if (response && response.data.err === 0) {
            this.setState({
                dataTop100: response.data.data.items[3].items
            })
        }
    }
    handleClick = (item) => {
        this.props.history.push(`/detail-album/${item.encodeId}`)
    }
    render() {

        let { dataTop100 } = this.state
        return (
            <>
                <div className='detail-top-100'>
                    <h3 className='title'>Top 100</h3>
                    <div className="content-top-100">
                        {dataTop100 && dataTop100.length > 0 && dataTop100.map((item, index) => {
                            return (
                                <div onClick={() => this.handleClick(item)} key={index} className="box-img">
                                    <img src={item.thumbnailM} alt="" />
                                </div>
                            )
                        })}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailTop100));
