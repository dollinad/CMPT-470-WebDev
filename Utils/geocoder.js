const NodeGeocoder = require('node-geocoder')

const options = {
    provider: process.env.GEOCODE_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GOOGLE_API_KEY,
    formatter: null // 'gpx', 'string', ...
};
  
const geocoder = NodeGeocoder(options);

module.exports = geocoder;