const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

require('./server2')

const app = express()
const compiler = webpack(WebpackConfig)

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: '/__build__/'
  })
)

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))
const router = express.Router()
router.get('/simple/get', function(req, res) {
  res.json({
    msg: `hello world`
  })
})
router.get('/base/get', function(req, res) {
  res.json(req.query)
})
router.get('/interceptor/get', function(req, res) {
  res.json({
    msg: `hello world`,
    data: 0
  })
})
router.post('/base/post', function(req, res) {
  res.json(req.body)
})

router.post('/base/buffer', function(req, res) {
  let msg = []
  req.on('data', chunk => {
    if (chunk) {
      msg.push(chunk)
    }
  })
  req.on('end', () => {
    let buf = Buffer.concat(msg)
    res.json(buf.toJSON())
  })
})

// error
router.get('/error/get', function(req, res) {
  if (Math.random() > 0.5) {
    res.json({
      msg: `hello world`
    })
  } else {
    res.status(500)
    res.end()
  }
})

router.get('/error/timeout', function(req, res) {
  setTimeout(() => {
    res.json({
      msg: `hello world`,
      data: {}
    })
  }, 3000)
})

// 默认配置合并
router.post('/config/post', function(req, res) {
  res.json(req.body)
})

// 取消请求
router.get('/cancel/get', function(req, res) {
  setTimeout(() => {
    res.json({
      msg: `hello world`
    })
  }, 3000)
})

// withCredentials
router.get('/more/get', function(req, res) {
  res.json(req.cookies)
})
// withCredentials

router.get('/xsrf/setCookie', function(req, res) {
  res.cookie('XSRF-TOKEN-D', '1234abc')
  res.send('success for set cookie')
})

const multipart = require('connect-multiparty')
app.use(
  multipart({
    uploadDir: path.resolve(__dirname, 'upload-file')
  })
)

router.post('/more/upload', function(req, res) {
  console.log(req.body, req.files)
  res.end('upload success!')
})
app.use(router)

const port = process.env.PORT || 8080
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
