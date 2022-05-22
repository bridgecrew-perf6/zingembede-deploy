import './Chart.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2'
import { Chart } from 'chart.js/auto'
import { withRouter } from 'react-router-dom'




class ChartSection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                labels: this.props.data.data.times.filter(item => item.hour % 2 === 0).map(item => { return this.handleFormatTime(item.hour) }),
                datasets: [{
                    data: this.props.data.data.items[this.props.data.topSongs[0].encodeId].filter(item => item.hour % 2 === 0).map(item => { return item.counter }),
                    backgroundColor: 'white',
                    borderColor: 'orange',
                    borderWidth: 2,
                    tension: 0.2, // smooth line,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'red',
                    pointHitRadius: 5,
                },
                {
                    data: this.props.data.data.items[this.props.data.topSongs[1].encodeId].filter(item => item.hour % 2 === 0).map(item => { return item.counter }),
                    backgroundColor: 'white',
                    borderColor: 'blue',
                    borderWidth: 2,
                    tension: 0.2, // smooth line
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'red',
                    pointHitRadius: 5,
                }, {
                    data: this.props.data.data.items[this.props.data.topSongs[2].encodeId].filter(item => item.hour % 2 === 0).map(item => { return item.counter }),
                    backgroundColor: 'white',
                    borderColor: 'yellow',
                    borderWidth: 2,
                    tension: 0.2, // smooth line
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'red',
                    pointHitRadius: 5,
                }

                ]
            },
            options: {
                pointRadius: 0,
                aspectRatio: 4,
                responsive: true,
                // maintainAspectRatio: false, //set radio width / heigth
                scales:
                {
                    y: {
                        ticks: {
                            display: false, // hide y axis
                        },
                        grid: {
                            borderDash: [4, 20], //dotted grid [ width, between ]
                            color: "rgb(150,150,150)"
                        },
                        // max: this.props.data.data.maxScore,
                        min: this.props.data.data.minScore
                    },
                    x: {
                        grid: {
                            color: 'transparent'
                        },
                        ticks: {
                            color: 'white',
                            font: {
                                size: 16,
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false // hide legenda
                    },
                },
                hover: {
                    mode: 'dataset',
                    intersect: false
                },


            },
            dataTopSongs: this.props.data.topSongs
        }
    }
    handleFormatTime = (hour) => {
        return `${hour}:00`
    }
    handlePercentTopSong = (score) => {
        let totalScore = this.props.data.data.totalScore
        return `${Math.floor((score * 100 / totalScore), 0)}%`
    }

    render() {
        let { dataTopSongs } = this.state
        dataTopSongs.length = 3 // keep the top 3 songs

        return (
            <div className="chartzing-container">
                <div onClick={() => this.props.history.push('/detail-chart')} className="name-title">#zingchart<i className="fa-solid fa-circle-play"></i></div>
                <div className='content-chart'>
                    {this.props.home && <div className="top-song">
                        {dataTopSongs && dataTopSongs.map((item, index) => {
                            return (
                                <div onClick={() => this.props.history.push('/detail-chart')} key={index} className="box-top-song">
                                    <div className="left-top-song">
                                        <div className="rank">{index + 1}</div>
                                        <div className="wrap-avtar">
                                            <img src={item.thumbnail} alt="" />
                                        </div>
                                        <div className="info-song">
                                            <div className="h3">{item.title}</div>
                                            <div className="artist opty-5">{item.artistsNames}</div>
                                        </div>
                                    </div>
                                    <div className="percent">{this.handlePercentTopSong(item.score)}</div>
                                </div>
                            )
                        })}
                        <div onClick={() => this.props.history.push('/detail-chart')} className="see-more">Xem thêm</div>
                    </div>}

                    <Line className='chart-line' data={this.state.data} options={this.state.options} />
                </div>
            </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChartSection));
