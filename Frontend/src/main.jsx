import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Read token from URL fragment if present (e.g. after OAuth redirect: #token=...)
try {
	const hash = window.location.hash;
	if (hash && hash.includes('token=')) {
		const params = new URLSearchParams(hash.replace(/^#/, ''));
		const token = params.get('token');
		if (token) {
			localStorage.setItem('token', token);
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			// remove token from URL for cleanliness
			history.replaceState(null, '', window.location.pathname + window.location.search);
		}
	} else if (localStorage.getItem('token')) {
		axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
	}
} catch (e) {
	console.error('Error handling OAuth token in URL fragment', e);
}

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<App />
	</StrictMode>,
)
