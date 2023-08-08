const checkIPAddress = (req, res, next) => {
  const allowedIP = process.env.IP;
  let clientIP = req.ip; // Express provides the IP in req.ip

  // Handle IPv4-mapped IPv6 addresses
  if (clientIP.startsWith("::ffff:")) {
    clientIP = clientIP.split(":").pop(); // Extract the IPv4 part
  }

  if (clientIP === allowedIP) {
    next(); // Allow access to the route
  } else {
    res.status(404).send("Not Found"); // Deny access with a 404 response
  }
};
