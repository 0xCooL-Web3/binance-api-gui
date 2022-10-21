import React from 'react';
import ReactDOM from 'react-dom/client';
import Information from './class/Information';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render([
    <Information symbol="BTCUSDT" interval="1h" length="24" />, 
    <Information symbol="BTCUSDT" interval="1d" length="30" />, 
    <Information symbol="ETHUSDT" interval="1h" length="24" />, 
]);