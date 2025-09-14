const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || process.env.EXPRESS_SESSION_SECRET || 'change_this_secret';

function requireAuth(req, res, next) {
	try {
		// Accept token from Authorization header (Bearer) or cookie
		let token = null;
		if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
			token = req.headers.authorization.split(' ')[1];
		} else if (req.cookies && req.cookies.token) {
			token = req.cookies.token;
		}
		if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
		const decoded = jwt.verify(token, JWT_SECRET);
		req.userId = decoded.id;
		next();
	} catch (err) {
		return res.status(401).json({ success: false, message: 'Invalid token' });
	}
}

module.exports = { requireAuth };
