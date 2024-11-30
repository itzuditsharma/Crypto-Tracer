import { makeStyles } from '@material-ui/core';
import axios from "axios";
import React from 'react'
import { TrendingCoins } from '../../config/api';
import { CryptoState } from '../../CryptoContext';
import { useState, useEffect } from 'react';
import AliceCarousel from 'react-alice-carousel';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    carousel: {
        height: "50%",
        display: "flex",
        alignItems: "center",
        // border: "2px solid white",
    },
    carouselItem : {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        textTransform: "uppercase",
        color: "white"
    }
}))

// A global function for having commas in numbers 
export function numberWithCommas(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Carousel = () => {
    
    const [trending, setTrending] = useState([]);
    const classes = useStyles();

    // TrendingCoins api need a currency which will be provided via context API 
    const {currency, symbol} = CryptoState();

    // fetching API -> present in config/api.js
    // data fetched will be stored in data 
    const fetchTrendingCoins = async() =>{
        const {data} = await axios.get(TrendingCoins(currency))

        setTrending(data);
    }

    console.log(trending)
    // We will be using it when the component is rendered for the first time  so we will use useEffect 
    useEffect(() => {
        fetchTrendingCoins();
        // eslint-disable-next-line
    }, [currency]);

        const items = trending.map((coin)=>{

            let profit = coin.price_change_percentage_24h >= 0;
            return (
                <Link
                    className = {classes.carouselItem} 
                    to = {`/coins/${coin.id}`}
                >
                    {/* Image of currency  */}
                    <img
                        src = {coin?.image}
                        alt = {coin.name}
                        height = "80"
                        style = {{marginBottom: 10}}
                    />
                    {/* Up or Low for the day  */}
                    <span>
                        {coin?.symbol}
                            &nbsp;
                            <span
                            style={{
                                color: profit>0? "rgb(14,203,129)" : "red",
                                fontWeight : 500,
                            }}
                            >
                                {profit && "+"}
                                {coin?.price_change_percentage_24h?.toFixed(2)}% 
                            </span>
                    </span>

                    {/* Price of CryptoCurrency  */}
                    <span style={{fontSize: 22, fontWeight: 500}}>
                        {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
                    </span>
                </Link>
            )
        })

        // if size is greater than 0px and less than 512 px, show 2 items 
        // if pixels is greater than 512 then show 4 items 
        const responsive = {
            0: {
                items: 2,
            },
            512: {
                items: 4,
            },
        };

  return (
    <div className={classes.carousel}>
        <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration ={1500}
        disableDotsControls    
        disableButtonsControls    
        responsive = {responsive} //how many elements you want to have on screen at a time
        autoPlay
        items = {items}
        />    
    </div>
  )
}

export default Carousel;