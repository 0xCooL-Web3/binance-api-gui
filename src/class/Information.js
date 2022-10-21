import React from "react";
import axios from "axios";
import { FaPlay } from "react-icons/fa";
import { GiBullHorns, GiBearFace } from "react-icons/gi";
import { MdFiberNew } from "react-icons/md";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


class Information extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            open: "Unknow", 
            high: "Unknow", 
            low: "Unknow", 
            close: "Unknow", 
        };
    }

    /*
        [Example - return result]

        [
            1499040000000,      // Kline open time
            "0.01634790",       // Open price
            "0.80000000",       // High price
            "0.01575800",       // Low price
            "0.01577100",       // Close price
            "148976.11427815",  // Volume
            1499644799999,      // Kline Close time
            "2434.19055334",    // Quote asset volume
            308,                // Number of trades
            "1756.87402397",    // Taker buy base asset volume
            "28.46694368",      // Taker buy quote asset volume
            "0"                 // Unused field, ignore.
        ]
    */
    buildUrl = (symbol, interval, limit=24) => 
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

    async fetchData(){
        let url = this.buildUrl(this.props.symbol, this.props.interval, this.props.length);

        return new Promise((resolve, reject) => {
            axios.get(url)
                .then(response => {
                    let data = response.data;
                    let highest = Number.MIN_VALUE;
                    let lowest = Number.MAX_VALUE;
                    let rise = 0;

                    for(let arr of data){
                        highest = Math.max(highest, +arr[2]);
                        lowest = Math.min(lowest, +arr[3]);
                        rise += (+arr[4]) > (+arr[1])
                    }
                        
                    let infor = {
                        open: +data[0][1], 
                        high: highest, 
                        low: lowest, 
                        close: +data[data.length - 1][4], 
                        chart_data: []
                    };
                    
                    resolve(infor);
                })
                .catch(err => reject(err));
        });
    }

    componentDidMount(){
        this.timerID = setInterval(() => {
            this.fetchData()
                .then(obj => this.setState(obj))
        }, 1000);
    }
    
    componentWillUnmount(){
        clearInterval(this.timerID);
    }

    render(){
        return  <>
            <h4>Symbol: {this.props.symbol}, Interval: {this.props.interval}</h4>
            <div>
                <big><FaPlay /></big>
                <span>開盤價： {this.state.open}</span>
            </div>
            <div>
                <big><GiBullHorns /></big>
                <span>最高價： {this.state.high}</span>
            </div>
            <div><MdFiberNew /> 最新價： {this.state.close}</div>
            <div><GiBearFace /> 最低價： {this.state.low}</div>
        </>;
    }
 
}

export default Information;