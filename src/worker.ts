
import { Hono } from 'hono';
import { logger } from 'hono/logger'
import { ApiError } from './utils/ApiError';
import { defaultRoutes } from './routes';

import httpStatus from 'http-status';

const app = new Hono();
app.use('*', logger());

app.notFound(() => {
	throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
});

app.get('/', (c) =>  c.json({ message: 'WELCOME TO SERVERLESS LAWYER RESTFULL API !!!!', status: httpStatus.OK }, 200))

defaultRoutes.forEach((route) => {
	app.route(`${route.path}`, route.route);
});

export default app