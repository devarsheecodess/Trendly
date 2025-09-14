const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || process.env.EXPRESS_SESSION_SECRET || 'change_this_secret';

async function resolveUserId(req) {
	let id = req.query.id || req.query.userId;
	if (!id || id === 'null' || id === 'undefined') {
		try {
			const token = req.cookies && req.cookies.token;
			if (token) {
				const decoded = jwt.verify(token, JWT_SECRET);
				id = decoded && decoded.id;
			}
		} catch (err) {
			id = null;
		}
	}
	return id || null;
}

module.exports = { resolveUserId };
