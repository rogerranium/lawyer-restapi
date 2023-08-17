
import { Hono } from 'hono';
import { logger } from 'hono/logger'
import { basicAuth } from 'hono/basic-auth'

import { ApiError } from './utils/ApiError';
import { defaultRoutes } from './routes';

import httpStatus from 'http-status';

const app = new Hono();
app.use('*', logger());

app.use(
	'/v1/*',
	basicAuth({
		username: 'clinton',
		password: '1234',
	})
);

// Add X-Response-Time header
app.use('*', async (c, next) => {
	const start = Date.now()
	await next()
	const ms = Date.now() - start
	c.header('X-Response-Time', `${ms}ms`)
})

// Custom Not Found Message
app.notFound(() => {
	throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
});

// Error handling
app.onError((err, c) => {
	console.error(`${err}`)
	return c.text('Custom Error Message', 500)
})


app.get('/', (c) => c.json({ message: 'WELCOME TO SERVERLESS LAWYER RESTFULL API !!!!', status: httpStatus.OK }, 200))

// Redirect
app.get('/redirect', (c) => c.redirect('/v1/users'));

defaultRoutes.forEach((route) => {
	app.route(`${route.path}`, route.route);
});

export default app