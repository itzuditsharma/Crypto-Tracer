import React from 'react'
import { makeStyles, Container, Typography } from '@material-ui/core'
import Carousel from './Carousel';

const useStyles = makeStyles(()=>({
    banner: {
        backgroundImage : "url(./banner3.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPositionY: "center"
        
    },
    bannerContent : {
        height: 400,
        display: "flex",
        flexDirection: "column",
        paddingTop: 25,
        justifyContent: "space-around",
        color: "#EEEEEE"
    },
    tagline:{
        display: "flex",
        height: "40%",
        flexDirection: "column",
        // justifyContent: "center",
        // textAlign: "center",
    },
}));

const Banner = () => {
    const classes = useStyles();

  return (
    <div className={classes.banner}>
        <Container className={classes.bannerContent}>
            <div className={classes.tagline}>
                <Typography variant = "h2"
                style={{
                    fontWeight: "bold",
                    marginBottom: 15,
                    fontFamily: "Montserrat",
                }}
                >
                    Udit's Crypto Tracer
                </Typography>

                <Typography variant = "subtitle2"
                style={{
                    fontWeight: "darkgrey",
                    textTransform: "capitalize",
                    fontFamily: "Montserrat",
                }}
                >
                    Get all the info regarding your favourite Crypto Currency 
                </Typography>
            </div>
            <Carousel />
        </Container>
    </div>
  );
};

export default Banner