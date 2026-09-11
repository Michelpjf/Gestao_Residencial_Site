export function getAuthContext(req, res) {
  res.status(200).json(req.auth);
}
