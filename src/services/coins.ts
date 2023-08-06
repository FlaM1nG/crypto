import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://api.coincap.io/v2/',
    timeout: 1000,
  });

  export type CoinData = {
    id: string;
    rank: string;
    symbol: string;
    name: string;
    supply: string;
    maxSupply: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    priceUsd: string;
    changePercent24Hr: string;
    vwap24Hr: string;
    explorer: string;
  }
  
  export type CoinResponse<T> = {
    timestamp: number;
    data: T[];
  }

  export type MarketData = {
    baseId: string,
    baseSymbol: string,
    exchangeId: string,
    priceUsd: string
    quoteId: string,
    quoteSymbol: string,
    volumePercent: string,
    volumeUsd24Hr: string,
    url?: string,
    isLoading?: boolean  
  }

  export type AssetHistoryData = {
    circulatingSupply: string,
    date: string,
    time: number,
    priceUsd: string
  }

  export type ExchangeData = {
    exchangeId: string,
    exchangeUrl: string,
    name: number,
    percentTotalVolume: string,
    rank: string,
    socket: boolean,
    tradingPairs: string,
    updated: number,
    volumeUsd: string,
  }

  const coins = {
    getAssets: async (id: number): Promise<CoinData[]> => {
      const { data: assets } = await instance.get<CoinResponse<CoinData>>('/assets', {
        params: { limit: id },
      });
      return assets.data;
    },
  
    getAsset: async (coin: string): Promise<CoinData[]> => {
      const { data: asset } = await instance.get<CoinResponse<CoinData>>(`/assets/${coin}`);
      return asset.data;
    },

    getAssetHistory: async (coin: string): Promise <AssetHistoryData[]> => {
      const now = new Date();
      const end = now.getTime();
      now.setDate(now.getDate() - 1);
      const start = now.getTime()

      const { data: history } = await instance.get<CoinResponse<AssetHistoryData>>(`/assets/${coin}/history`, { params: { interval: 'h1', start: start, end: end }});
      return history.data;  
    },
    getMarkets: async (coin: string, id: number): Promise <MarketData[]> => {
      const { data: markets }  = await instance.get<CoinResponse<MarketData>>(`/assets/${coin}/markets`, {
        params: { limit: id },
      });
      return markets.data;
    },
    getExchange: async (coin: string): Promise <ExchangeData[]> => {
      const { data: exchange } = await instance.get<CoinResponse<ExchangeData>>(`/exchanges/${coin}`)
      return exchange.data;
    },
  }
  
  export default coins;