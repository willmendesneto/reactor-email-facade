module.exports = function ignoreFavicon(req, res, next) {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204);
    res.json({ nope: true });
  } else {
    next();
  }
};
