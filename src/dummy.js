import axios from 'axios'
import React from 'react'
import { useState, useEffect } from 'react'
import {CryptoState} from "../CryptoContext"
import {HistoricalChart} from "../config/api"
import { CircularProgress, createTheme, ThemeProvider } from '@material-ui/core'
import { ClassNames } from '@emotion/react'
import { makeStyles } from "@material-ui/core/styles";
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import { borderColor } from '@mui/material/node_modules/@mui/system'

const CoinInfo = ({coin}) => {


  const [historicData, sethistoricData] = useState()
  const [days, setDays] = useState(1)

  const {currency} = CryptoState();

  const fetchHistoricData = async() => {
    const {data} = await axios.get(HistoricalChart(coin.id, days, currency ))
    // we need only the prices of data 
    sethistoricData(data.prices)
  }

  console.log("data", historicData)

  useEffect(() => {
    fetchHistoricData();
    // eslint-disable-next-line
  }, [currency, days])
  
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const useStyles = makeStyles((theme)=>({
    container: {
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      [theme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      },
    },
  }))

  const classes = useStyles();

  return (
    <ThemeProvider theme = {darkTheme}>
      <div className={ClassNames.container}>
        {
          !historicData ?(
            <CircularProgress
            style={{color: "gold"}}
            size = {250}
            thickness = {1}
            />
          ):(
          <>
          {/* The vertical and horizontal info price and dates is labels  */}
          <Line
            data={{
              labels: historicData.map((coin) => {
                // coin[0] -> days 
                let date = new Date(coin[0]);
                let time =
                  date.getHours() > 12
                    ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                    : `${date.getHours()}:${date.getMinutes()} AM`;
                return days === 1 ? time : date.toLocaleDateString();
              }),
              datasets: [{
                data : historicData.map((coin)=>coin[1]),
                label: `Price(Past ${days} Days) in ${currency}`,
                borderColor: "#EEBC1D"
              }],
            }}
          />
          </>
          )}
      </div>
    </ThemeProvider>


  )
}

export default CoinInfo  