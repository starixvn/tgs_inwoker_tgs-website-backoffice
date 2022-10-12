const httpProxy = require("http-proxy")
const apiProxy = httpProxy.createServer({ target: "http://localhost:3001" }) //dev: "http://dev-bo.rpgp.cc"

/*
TODO: how to setup api web socket?
const signalRWsProxy = httpProxy.createServer({
  target: "ws://localhost:3001/",
  ws: true
})
const signalRHttpProxy = httpProxy.createServer({
  target: "http://localhost:3001/"
})
*/

module.exports = {
  mount: {
    public: { url: "/", static: true },
    static: { url: "/", static: true, resolve: false },
    src: { url: "/dist" }
  },
  plugins: [
    "@snowpack/plugin-babel",
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-dotenv"
  ],
  devOptions: {
    port: 3000
  },
  buildOptions: {
    metaUrlPath: "snowpack"
  },
  routes: [
    /*
    {
      match: "all",
      src: "/api/notify/.*",
      dest: (req, res) => {
        console.log("/api/notify/.* http route")
        signalRHttpProxy.web(req, res)
      }
    },
    {
      match: "all",
      src: "/api/notify",
      dest: (req, res) => {
        console.log("/api/notify/ web socker route")
        signalRWsProxy.ws(req, res.socket)
      }
    },
    */
    {
      src: "/api/.*",
      dest: (req, res) => {
        return apiProxy.web(req, res)
      }
    },
    // {
    //   src: "/fs/.*",
    //   dest: (req, res) => fileApiProxy.web(req, res)
    // },
    { match: "routes", src: ".*", dest: "/index.html" }
  ]
}
