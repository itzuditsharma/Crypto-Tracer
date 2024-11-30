import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from "axios";
import { CoinList } from "./config/api";
import { onAuthStateChanged } from 'firebase/auth';
import { auth , db} from './firebase';
import { onSnapshot, doc } from "firebase/firestore";


// Crypto is the name of our context 
const Crypto = createContext();

const CryptoContext = ({children}) => {

    const [currency, setCurrency] = useState("INR")
    const [symbol, setSymbol] = useState("₹")
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null)
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: "success"
    });
    const [watchlist, setWatchlist] = useState([])


    // For Setting up our Watch List 
    // if user is logged in, it will take reference to the user 
    // onSnapshot checks if our database is updated or not 
    // Snapshot is like an event which continously monitors
    // We dont want such thing to happen, so we will unsubscribe from it 


    useEffect(() => {
        if (user) {
          const coinRef = doc(db, "watchlist", user?.uid);
          var unsubscribe = onSnapshot(coinRef, (coin) => {
            if (coin.exists()) {
              console.log(coin.data().coins);
              setWatchlist(coin.data().coins);
            } else {
              console.log("No Items in Watchlist");
            }
          });
    // When our component is unmounted then return unsubscribe 
          return () => {
            unsubscribe();
          };
        }
      }, [user]);


    useEffect(()=>{
        onAuthStateChanged(auth, (user)=>{
            if(user) setUser(user);
            else setUser(null);

            console.log(user)
        })
    }, []);


    const fetchCoins = async () => {
        setLoading(true);
        const { data } = await axios.get(CoinList(currency));
        console.log(data);
    
        setCoins(data);
        setLoading(false);

        
      };
    

    // Whenever a component is rendered, whatever is written inside useEffect is going to run 
    // This will run everytime the currency changes -> currency as dependency
    useEffect(() => {
      if(currency === "INR") setSymbol("₹");
      else if (currency === "USD") setSymbol("$");
    }, [currency]);
    
    return (
        <Crypto.Provider value = {{currency, symbol, setCurrency, coins, loading, fetchCoins, alert, setAlert, user, watchlist}}>
            {children}
        </Crypto.Provider>
    )
}

export default CryptoContext

export const CryptoState = () => {
    return useContext(Crypto);
};

