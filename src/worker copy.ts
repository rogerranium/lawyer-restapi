import { Hono } from 'hono';
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/cloudflare-workers';

import { keyword } from 'color-convert';
import { KEYWORD } from 'color-convert/conversions';

import { PrismaClient } from "@prisma/client/edge";

import { IcreateUser } from './interface/iUser';
import { AppSettings } from './appsetting';

const prisma = new PrismaClient({
	datasources: {
		db: {
			url: "prisma://aws-eu-central-1.prisma-data.com/?api_key=EqfkqHRTYzVhCxy9qvSI15lG9aKj2AX37Msz-bWt8oyIJJsuJaFWFTRA_SUIjYpd"
		}
	}
})
const app = new Hono()

app.use('*', logger())
app.use('/static/*', serveStatic({ root: './' }))
app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))

app.get('/', (c) => c.text('This is Home! You can access: /static/hello.txt'))

// app.get('/:colorformat/:colorname', (ctx) => {
// 	const colorname: KEYWORD = ctx.req.param("colorname") as KEYWORD
// 	const colorformat: string = ctx.req.param("colorformat")

// 	if (colorformat == "hex") {
// 		return ctx.text("#" + keyword.hex(colorname))
// 	}

// 	if (colorformat == "rgb") {
// 		return ctx.text("RGB: " + keyword.rgb(colorname).toString())
// 	}
// 	return ctx.text("Specify correct colorname and colorformat")
// })

app.get('/posts/:id', (c) => {
	const id = c.req.param('id');
	c.header('X-Message', 'Hi!');
	return c.text(`Posts number ${id}`)
})

app.post('/users', async (c) => {
	const { firstName, lastName, email, password, addressFacturation, addressLivraison } = await c.req.json<IcreateUser>();

	const EMAIL_REGEX = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,3})$/i;

	if (!firstName.trim()) return c.json({ message: 'Please enter your firstName !!!!', status: AppSettings.HTTP_NOT_ACCEPTABLE }, AppSettings.HTTP_NOT_ACCEPTABLE);
	if (!lastName.trim()) return c.json({ message: 'Please enter your lastName !!!!', status: AppSettings.HTTP_NOT_ACCEPTABLE }, AppSettings.HTTP_NOT_ACCEPTABLE);

	if (!email.trim()) return c.json({ message: 'Please enter your email !!!!', status: AppSettings.HTTP_NOT_ACCEPTABLE }, AppSettings.HTTP_NOT_ACCEPTABLE);

	const emailValidator = EMAIL_REGEX.test(email);
	if (!emailValidator) return c.json({ message: 'Email incorrect !!!!', status: AppSettings.HTTP_NOT_ACCEPTABLE }, AppSettings.HTTP_NOT_ACCEPTABLE);

	if (!password.trim()) return c.json({ message: 'Please enter your password !!!!', status: AppSettings.HTTP_NOT_ACCEPTABLE }, AppSettings.HTTP_NOT_ACCEPTABLE);


	// By unique email
	const existUserWithEmail = await prisma.user.findUnique({
		where: {
			email: email,
		},
	})

	if (existUserWithEmail) {
		return c.json({ message: 'User exist with this email !!!!', status: AppSettings.HTTP_CONFLICT }, AppSettings.HTTP_CONFLICT)
	} else {
		try {
			const newUser = await prisma.user.create({
				data: {
					role: 'User',
					firstName: firstName,
					lastName: lastName,
					email: email,
					password: password,
					address: {
						addressFacturation: addressFacturation,
						addressLivraison: addressLivraison,
					},
				}
			})

			if (newUser) {
				return c.json({ message: 'User created !!!!', status: AppSettings.HTTP_CREATED }, AppSettings.HTTP_CREATED)
			}
		} catch (error) {
			return c.json({ message: 'Error created user !!!!', status: AppSettings.HTTP_INTERNAL_ERROR }, AppSettings.HTTP_INTERNAL_ERROR)
		}

	}

	return c.text("I dont know what do do i can i do !!!")
})

export default app