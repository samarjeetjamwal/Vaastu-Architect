export interface VastuResult {
  aaya: number;
  vyaya: number;
  yoni: number;
  vara: number;
  tithi: number;
  nakshatra: number;
  score: number;
  recommendations: string[];
}

export enum Direction {
  N = "N", NNE = "NNE", NE = "NE", ENE = "ENE", 
  E = "E", ESE = "ESE", SE = "SE", SSE = "SSE", 
  S = "S", SSW = "SSW", SW = "SW", WSW = "WSW", 
  W = "W", WNW = "WNW", NW = "NW", NNW = "NNW"
}

export enum Unit {
  FEET = "ft",
  METERS = "m"
}

export interface ZoneData {
  name: string;
  deg: number;
  ideal: string;
  color: string;
  description: string;
  element: string;
  dos: string[];
  donts: string[];
}

// Global declaration for external CDN libraries
declare global {
  interface Window {
    fabric: any;
    jspdf: any;
  }
}