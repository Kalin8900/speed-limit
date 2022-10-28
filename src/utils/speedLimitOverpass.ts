export const speedLimitOverpassQuery = (lat: number, long: number, radius = 25.0) =>
  `
[out:json][timeout:25];
(  
  way["highway"]["highway"!="footway"]["highway"!="steps"]["maxspeed"](around:${radius},${lat},${long});
);
out body;
>;
out skel qt;
`
    .replaceAll(/\s+/g, " ")
    .trim();
