import React, { useState, useEffect } from 'react'
import {useParams} from "react-router-dom"
import { SingleCoin } from '../config/api';
import {CryptoState} from "../CryptoContext"
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import CoinInfo from '../components/CoinInfo'
import { Typography, LinearProgress } from '@material-ui/core';
import ReactHtmlParser from "react-html-parser";
import { numberWithCommas } from "../components/Coinstable";
import { Button } from '@material-ui/core';
import {doc, setDoc} from "@firebase/firestore";
import { db } from "../firebase";

const CoinPage = () => {

  // The URL contains bitcoin as an id -> useParams will be used to fetch one single coin from our API 
  // id is present in App.js 
  // The react-router-dom package has useParams hooks that let you access the parameters of the current route.
  // on clicking the bitcoin, you will be redirected to CoinPage -> the url will hold bitcoin over there i.e. localhost:3000/coins/bitcoin -> this bitcoin is an ind that is stated in App.js 
  const {id} = useParams();   
  const [coin, setCoin] = useState();
  const {currency, symbol, user, watchlist, setAlert} = CryptoState();

  const fetchCoin = async() =>{
    const {data} = await axios.get(SingleCoin(id));
    setCoin(data);
  }

  console.log(coin)
  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line
  }, [])

  const useStyles = makeStyles((theme)=> ({
      container: {
        display: "flex",
        // if screen size is less then medium screen the flex : column and alignitems : center 
        [theme.breakpoints.down("md")] : {
          flexDirection : "column",
          alignItems : "center",
        },
      },
      sidebar: {
        width: "30%",
        [theme.breakpoints.down("md")]: {
          width: "100%",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 25,
        borderRight: "2px solid grey",
      },
      heading: {
        fontWeight: "bold",
        marginBottom: 20,
        fontFamily: "Montserrat",
      },
      description: {
        width: "100%",
        fontFamily: "Montserrat",
        padding: 25,
        paddingBottom: 15,
        paddingTop: 0,
        textAlign: "justify",
      },
      marketData: {
        alignSelf: "start",
        padding: 25,
        paddingTop: 10,
        width: "100%",
        [theme.breakpoints.down("md")]: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        [theme.breakpoints.down("xs")]: {
          alignItems: "start",
        },
      },
  }));

  const inWatchlist = watchlist.includes(coin?.id)

  const addToWatchlist = async() =>{
    const coinRef = doc(db, "watchlist", user.uid)
    try {
      await setDoc(coinRef,
        {coins:watchlist?[...watchlist, coin?.id]:[coin?.id],
        });

        setAlert({
          open: true,
          message : `${coin.name} Added to Watchlist`,
          type: "success",
        })
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error"
      });
    }
  };

 const removeFromWatchlist = async() => {
  const coinRef = doc(db, "watchlist", user.uid);
  try {
    await setDoc(
      coinRef,
      { coins: watchlist.filter((wish) => wish !== coin?.id) },
      { merge: true }
    );

    setAlert({
      open: true,
      message: `${coin.name} Removed from the Watchlist !`,
      type: "success",
    });
  } catch (error) {
    setAlert({
      open: true,
      message: error.message,
      type: "error",
    });
  }
 }


  const classes = useStyles();

  if(!coin) return <LinearProgress style = {{backgroundColor: "gold"}}/>

  return (
  
      <div className={classes.container}>
        <div className = {classes.sidebar}>
        <img
          src={coin?.image.large}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />

        <Typography variant = "h3" className={classes.heading}>
          {coin?.name}
        </Typography>

        {/* The data coming from API had some html inside it which is needed to be parsed till the first full stop occurs */}
        <Typography variant="subtitle1" className={classes.description}>
          {ReactHtmlParser(coin?.description.en.split(". ")[0])}.
        </Typography>

        <div className={classes.marketData}>
          {/* RANK  */}
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {coin?.market_cap_rank}
            </Typography>
          </span>

          {/* Current Price  */}
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>

          {/* Market Cap  */}
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Market Cap:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
              M
            </Typography>
          </span>
                {user && (
                  <Button
                  variant="outlined"
                  style={{
                    width: "100%",
                    height: 40,
                    // backgroundColor: "#EEBC1D",
                    backgroundColor: inWatchlist ? "#ff0000" : "#EEBC1D",
                  }}
                  onClick={inWatchlist? removeFromWatchlist:  addToWatchlist}
                  
                >
                  {inWatchlist? "Remove from Watchlist": "Add to Watchlist"}
                </Button>
                )}
        </div>

        {/* ---------------------------------------------------------------------- */}
        {/* Chart  */}
      </div>
        <CoinInfo coin = {coin}/>
      </div>

         
  )
}

export default CoinPage