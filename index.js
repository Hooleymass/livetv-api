/*import jsonServer from 'json-server';

const server = jsonServer.create();

const router = jsonServer.router('./api/dbupdate.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 5000;

server.use(middleware}); 
server.use(router); 
server.listen(port);*/

const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use('', router)
server.listen(process.env.PORT || 5000, () => {
  console.log('JSON Server is running')
})
