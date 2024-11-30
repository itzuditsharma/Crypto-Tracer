import React from 'react'
import {AppBar, Container, Toolbar, Typography, Select, MenuItem, createTheme, ThemeProvider} from "@material-ui/core"
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import {CryptoState} from "../CryptoContext"
import AuthModal from './Authentication/AuthModal';
import UserSidebar from './Authentication/UserSidebar';

const useStyles = makeStyles(()=>({
  title:{
    flex : 1,
    color: "#EEEEEE",
    // color: "#78938A",
    fontFamily : "Montserrat",
    fontWeight: "bold",
    cursor: "pointer"
  }
}))


const Header = () => {
  // creating an object 
  const classes = useStyles();

  // Used to navigate on click 
  const history = useHistory();

  const {currency, setCurrency, user} = CryptoState()
  console.log(currency)

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  return (
    
      <ThemeProvider theme = {darkTheme}>
      <AppBar color = 'transparent' position='static'>
        <Container>
          <Toolbar>
            <Typography onClick = {()=> history.push('/')} className={classes.title} variant = "h6">
              Udit's Crypto Tracer
            </Typography>
            <Select variant= "outlined"
            style = {{
              width: 100,
              height: 40,
              marginRight: 15
            }}
            value = {currency}
            onChange = {(e)=> setCurrency(e.target.value)}
            >
              <MenuItem value = {"USD"}>USD</MenuItem>
              <MenuItem value = {"INR"}>INR</MenuItem>
            </Select>
            {user? <UserSidebar/>: <AuthModal/>}
          </Toolbar>
        </Container>
      </AppBar>
      </ThemeProvider>
  )
}

export default Header
