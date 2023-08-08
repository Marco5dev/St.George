// middleware/checkIPAddress.js
const checkIPAddress = (req, res, next) => {
  const allowedIP = '197.54.107.214';
  let clientIP = req.ip;

  if (clientIP.startsWith('::ffff:')) {
    clientIP = clientIP.split(':').pop();
  }

  if (clientIP === allowedIP) {
    next();
  } else {
    res.status(404).send('Not Found');
  }
};

module.exports = checkIPAddress;