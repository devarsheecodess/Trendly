const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || process.env.EXPRESS_SESSION_SECRET || 'change_this_secret';

function requireAuth(req, res, next) {
	try {
		const token = req.cookies && req.cookies.token;
		if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
		const decoded = jwt.verify(token, JWT_SECRET);
		req.userId = decoded.id;
		next();
	} catch (err) {
		return res.status(401).json({ success: false, message: 'Invalid token' });
	}
}

module.exports = { requireAuth };
