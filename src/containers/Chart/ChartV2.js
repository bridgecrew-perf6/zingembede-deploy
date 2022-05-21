import './ChartV2.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2'
import { Chart } from 'chart.js/auto'
import { withRouter } from 'react-router-dom'




class ChartV2 extends Component {
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
                maintainAspectRatio: false, //set radio width / heigth
                scales:
                {
                    y: {
                        ticks: {
                            display: false, // hide y axis
                        },
                        grid: {
                            borderDash: [2, 10], //dotted grid [ width, between ]
                            color: "rgba(150,150,150,0.5)"
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

        return (
            <div className="chartzing-v2-container">
                <div className="under-chart"></div>
                <Line className='chart-line' data={this.state.data} options={this.state.options} />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChartV2));
