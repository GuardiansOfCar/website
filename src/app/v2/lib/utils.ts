import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { ReadonlyURLSearchParams } from "next/navigation";
import { Coin } from "@/app/v2/lib/use-wallet-store";

export const getReferral = (searchParms: ReadonlyURLSearchParams, fallbackValue?: string) => {
  const r = searchParms.get("r");
  if (r) {
    return r;
  } else if (fallbackValue) {
    return fallbackValue;
  } else {
    return "gotcar";
  }
};

export const getCoinLabel = (net: Coin) => {
  switch (net) {
    case "ETH":
      return "ETHEREUM";
    case "SOL":
      return "SOLANA";
    case "BNB":
      return "BNB";
    case "USDT":
      return "USDT";
  }
};

export function shortenAddress(
    address: string,
    startLength: number = 6,
    endLength: number = 4,
) {
  if (!address || address.length < startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

// Google Analytics tracking functions
declare global {
  interface Window {
    dataLayer?: any[];
  }
}

/**
 * Get the Binance symbol for a given coin
 */
const getBinanceSymbol = (coin: Coin): string => {
  switch (coin) {
    case "ETH":
      return "ETHUSDT";
    case "BNB":
      return "BNBUSDT";
    case "SOL":
      return "SOLUSDT";
    case "USDT":
      return "USDTUSDT"; // USDT to USDT is always 1:1, but we'll fetch it for consistency
    default:
      return "ETHUSDT"; // fallback to ETH
  }
};

/**
 * Fetch current price from Binance API
 */
const fetchCoinPrice = async (coin: Coin): Promise<number> => {
  try {
    // For USDT, return 1.0 directly as it's pegged to USD
    if (coin === "USDT") {
      return 1.0;
    }

    const symbol = getBinanceSymbol(coin);
    const response = await fetch(`https://api.binance.com/api/v3/aggTrades?symbol=${symbol}&limit=1`);
    
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0 && data[0].p) {
      return parseFloat(data[0].p);
    }
    
    throw new Error("Invalid response format from Binance API");
  } catch (error) {
    console.error(`Error fetching price for ${coin}:`, error);
    
    // Fallback prices if API fails
    switch (coin) {
      case "ETH":
        return 3000; // fallback ETH price
      case "BNB":
        return 600;  // fallback BNB price
      case "SOL":
        return 200;  // fallback SOL price
      case "USDT":
        return 1.0;  // USDT is always 1:1 with USD
      default:
        return 1.0;
    }
  }
};

/**
 * Calculate USD value for a given amount and coin type
 */
const calculateUSDValue = async (amount: number, coin: Coin): Promise<number> => {
  const pricePerUnit = await fetchCoinPrice(coin);
  return amount * pricePerUnit;
};

/**
 * Tracks wallet connection event for Google Analytics
 * Should be called once per user in a browser after successful wallet connection
 */
export const trackWalletConnect = () => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: "wallet_connect"
    });
  }
};

/**
 * Tracks purchase event for Google Analytics with automatic USD conversion
 * Should be called once in a browser after each successful purchase
 * @param transactionId - Unique transaction hash/ID
 * @param amount - Transaction amount in the original cryptocurrency
 * @param coin - The cryptocurrency type used for the transaction
 */
export const trackPurchase = async (transactionId: string, amount: number, coin: Coin) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    try {
      // Calculate USD value based on current exchange rate
      const usdValue = await calculateUSDValue(amount, coin);
      
      // Clear previous ecommerce data
      window.dataLayer.push({ ecommerce: null });
      
      // Push purchase event with USD value
      window.dataLayer.push({
        event: "purchase",
        ecommerce: {
          transaction_id: transactionId,
          currency: "USD",
          value: parseFloat(usdValue.toFixed(2)) // Round to 2 decimal places
        }
      });
    } catch (error) {
      console.error("Error tracking purchase:", error);
      
      // Fallback: track with original amount if USD conversion fails
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: "purchase",
        ecommerce: {
          transaction_id: transactionId,
          currency: "USD",
          value: amount // Use original amount as fallback
        }
      });
    }
  }
};

/**
 * Legacy function for backward compatibility - now uses coin-based conversion
 * @deprecated Use trackPurchase(transactionId, amount, coin) instead
 */
export const trackPurchaseWithValue = (transactionId: string, value: number, currency: string = "USD") => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    // Clear previous ecommerce data
    window.dataLayer.push({ ecommerce: null });
    
    // Push purchase event
    window.dataLayer.push({
      event: "purchase",
      ecommerce: {
        transaction_id: transactionId,
        currency: currency,
        value: value
      }
    });
  }
};