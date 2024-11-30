// Will be used in table in homepage -> table ]
export const CoinList = (currency) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

// Will be used to fetch a single coin 
export const SingleCoin = (id) =>
  `https://api.coingecko.com/api/v3/coins/${id}`;


// Will be used in Chart component to display localhost:3000/charts  /coins/bitcoin
export const HistoricalChart = (id, days = 365, currency) =>
  `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;


// For the purpose of currency such as USD, INR etc.
export const TrendingCoins = (currency) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;