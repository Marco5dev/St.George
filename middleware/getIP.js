// middleware/checkIPAddress.js
const axios = require('axios');

const checkIPAddress = async (req, res, next) => {
  const allowedIP = '197.54.107.214';

  try {
    const response = await axios.get('http://httpbin.org/ip');
    const responseData = response.data;
    const publicIPv4 = responseData.origin;

    console.log('Server Public IPv4:', publicIPv4);

    // Compare the public IPv4 with the allowed IP
    if (publicIPv4 === allowedIP) {
      next();
    } else {
      res.status(404).send('Not Found');
    }
  } catch (error) {
    console.error('Error fetching public IPv4:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = checkIPAddress;
