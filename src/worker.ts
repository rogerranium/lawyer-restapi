import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { keyword } from 'color-convert';
import { KEYWORD } from 'color-convert/conversions';

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))
app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))

app.get('/', (c) => c.text('This is Home! You can access: /static/hello.txt'))

app.get('/:colorformat/:colorname', (ctx) => {
	const colorname: KEYWORD = ctx.req.param("colorname") as KEYWORD
	const colorformat: string = ctx.req.param("colorformat")
	
	if (colorformat == "hex") {
		return ctx.text("#" + keyword.hex(colorname))
	}

	if (colorformat =="rgb"){
		return ctx.text("RGB: " + keyword.rgb(colorname).toString())
	}
	return ctx.text("Specify correct colorname and colorformat")
})

app.get('/posts/:id', (c) => {
	const page = c.req.query('page')
	const id = c.req.param('id')
	c.header('X-Message', 'Hi!')
	return c.text(`You want see ${page} of ${id}`)
})

export default app