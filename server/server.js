const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

const PORT = process.env.PORT || 5000;

// logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

router
    .get('/api/users', (ctx, next) => {
        ctx.body = { message: 'Users' };
        console.log('REQUEST');
    });

app
    .use(router.routes())
    .use(router.allowedMethods())
    .use(require('koa-static')(__dirname + '/../client/build'));

app.listen(PORT, console.log(`API server started on ${PORT}`));
