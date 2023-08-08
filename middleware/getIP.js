// middleware/checkIPAddress.js
const checkIPAddress = (req, res, next) => {
  const allowedIP = '197.54.107.214';
  let clientIP = req.ip;

  if (clientIP.startsWith('::ffff:')) {
    clientIP = clientIP.substr(7); // Remove the IPv6 prefix
  }

  console.log('Client IPv4:', clientIP); // Log the IPv4 address

  if (clientIP === allowedIP) {
    next();
  } else {
    res.status(404).send('Not Found');
  }
};

module.exports = checkIPAddress;