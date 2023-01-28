const Hapi = require("@hapi/hapi");
const routes = require("./routes");

async function init() {
  const port = 5000;
  const host = process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0";
  const routesConfig = { cors: { origin: ["*"] } };

  const server = Hapi.server({ port, host, routes: routesConfig });
  server.route(routes);
  await server.start();

  console.log(`server run on ${server.info.uri}`);
}

init();
