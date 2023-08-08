const axios = require('axios');

const checkIPAddress = async (req, res, next) => {
  const allowedIP = '197.54.107.214';
  
  try {
    const response = await axios.get('http://api.ipify.org?format=json');
    const publicIP = response.data.ip;

    console.log('Server Public IP:', publicIP);

    // Compare the public IP with the allowed IP
    if (publicIP === allowedIP) {
      next();
    } else {
      res.status(404).send('Not Found');
    }
  } catch (error) {
    console.error('Error fetching public IP:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = checkIPAddress;