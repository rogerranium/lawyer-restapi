import { Hono } from 'hono'
import * as userController from '../controller/user.controller';

export const route = new Hono()

route.post('/',userController.createUser)
route.get('/', (c) => c.text('get'))

route.get('/:userId', (c) => c.text('get user id'))
route.patch('/:userId', (c) => c.text('patch'))
route.delete('/:userId', (c) => c.text('delete'))