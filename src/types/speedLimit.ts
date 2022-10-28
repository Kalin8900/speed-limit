export interface SpeedLimitQuery {
  lat: number;
  long: number;
  radius?: number;
}

export interface SpeedLimitWay {
  type: "way";
  id: number;
  tags: {
    highway?: string;
    maxspeed?: string;
    surface?: string;
    name?: string;
  };
  nodes: number[];
}

export interface SpeedLimitNode {
  type: "node";
  id: number;
  lat: number;
  lon: number;
}

export interface SpeedLimit {
  elements: (SpeedLimitWay | SpeedLimitNode)[];
}
