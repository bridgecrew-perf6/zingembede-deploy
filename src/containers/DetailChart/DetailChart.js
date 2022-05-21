import './DetailChart.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getChartHome } from '../../services/userService'
import * as actions from '../../store/actions'
import ChartV2 from '../Chart/ChartV2';
import PlayerMusic2 from '../BoxPlayMusic/PlayerMusic2';
import PlayListWithoutCD from '../PlayListWithoutCD/PlayListWithoutCD';
import Loading2 from '../Loading2/Loading2';




class DetailChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataChart: null,
            top100: null,
            showFull100: false,
            playMusic: false,
            idSong: null,
            customPlayMode: false,
            isLoading: false
        }
    }
    async componentDidMount() {
        this.setState({ isLoading: true })
        let response = await getChartHome()
        if (response) this.setState({ isLoading: false })
        if (response && response.data.err === 0) {
            this.setState({
                top100: response.data.data.RTChart.items,
                dataChart: { data: response.data.data.RTChart.chart, topSongs: response.data.data.RTChart.items.filter((item, index) => index < 3) }
            })
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.refreshPlayState !== this.props.refreshPlayState) {
            if (this.props.refreshPlayState === '2') {
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
        this.props.refreshPlay('2')
        this.setState({
            idSong: item.encodeId,
            playMusic: true
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
                customPlayMode: true
            })
        }
    }
    handleShowFull100 = () => {
        this.setState({
            showFull100: !this.state.showFull100
        })
    }
    startPlay = () => {
        this.setState({
            playMusic: true,
            idSong: this.state.top100[0].encodeId
        })
    }

    render() {
        let { top100, showFull100 } = this.state
        let top10 = top100 ? top100.filter((item, index) => index < 10) : top100
        let playlist = top100 && showFull100 ? top100 : top10


        return (
            <>
                <div className='detail-chart-container'>
                    <div className="chart-sectio">
                        <div className="zing-chart-title">#zingchart<i onClick={() => this.startPlay()} className="fa-solid fa fa-circle-play"></i></div>
                        {this.state.dataChart && <ChartV2 data={this.state.dataChart} />}
                    </div>
                    <div className="top-100-section">
                        {playlist && <PlayListWithoutCD
                            playlist={playlist}
                            idSong={this.state.idSong}
                            handlePlayMusic={this.handlePlayMusic}
                            rank={true}
                        />}
                        <div onClick={() => this.handleShowFull100()} className="see-more">{this.state.showFull100 ? 'Xem top 10' : 'Xem top 100'}</div>
                    </div>
                </div>
                {this.state.playMusic && <PlayerMusic2
                    idSong={this.state.idSong}
                    type={4}
                    album={playlist}
                    getCurrentSong={this.getCurrentSong}
                    handleCustomPlay={this.handleCustomPlay}
                    customPlayMode={this.state.customPlayMode}
                />}
                {this.state.isLoading && <Loading2 />}
            </>
        )
    }
}
const mapStateToProps = state => {
    return {
        dataHomePage3: state.dataHomePage3,
        refreshPlayState: state.refreshPlay
    };
};

const mapDispatchToProps = dispatch => {
    return {
        refreshPlay: (id) => dispatch(actions.refreshPlay(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailChart);
