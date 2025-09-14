const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || process.env.EXPRESS_SESSION_SECRET || 'change_this_secret';

async function resolveUserId(req) {
	let id = req.query.id || req.query.userId;
	if (!id || id === 'null' || id === 'undefined') {
		try {
			// Support Authorization: Bearer <token> header for frontend-local token flows
			let token;
			const authHeader = req.headers && (req.headers.authorization || req.headers.Authorization);
			if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
				token = authHeader.split(' ')[1];
			} else {
				token = req.cookies && req.cookies.token;
			}
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
