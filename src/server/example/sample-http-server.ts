// fastify.addHook('onRequest', async (req, res) => {
//   const rawRequest = req.raw
//   const rawResponse = res.raw
//   if (isHttp2Request(rawRequest)) {
//     const reqPath = rawRequest.url
//     const reqMethod = rawRequest.method
//     const reqStream = rawRequest.stream
//     reqStream.on('pushError', (err) => {
//       req.log!.error('Error while pushing', err)
//     })
//     if (reqPath === '/api/messages') {
//       if (reqMethod === 'GET') {
//         // immediately respond with 200 OK and encoding
//         reqStream.respond({
//           ':status': 200,
//           'content-type': 'text/plain; charset=utf-8',
//         })
//         // write the first response
//         reqStream.write(JSON.stringify(getMessages()))

//         // keep track of the connection
//         connections.push(reqStream)
//         // when the connection closes, stop keeping track of it
//         reqStream.on('close', () => {
//           connections = connections.filter((s) => s !== reqStream)
//         })
//       } else if (reqMethod === 'POST') {
//         // read data out of request
//         const buffers = []
//         for await (const chunk of rawRequest) {
//           buffers.push(chunk)
//         }
//         const data = Buffer.concat(buffers).toString()
//         const { username, message } = JSON.parse(data)
//         pushMessage({ username, message })

//         // all done with the request
//         rawResponse.end()

//         // notify all connected users
//         connections.forEach((stream) => {
//           stream.write(JSON.stringify(getMessages()))
//         })
//       }
//     }
//   }
// })

// fastify.get('/api/messages', async (request, reply) => {
//   if (!request.raw.stream) {
//     reply.status(500).send('Bad Request for Streams')
//   }

//   const stream = request.raw.stream
//   // immediately respond with 200 OK and encoding
//   stream.pushStream({
//     ':status': 200,
//     'content-type': 'text/plain; charset=utf-8',
//   })

//   // write the first response
//   stream.write(JSON.stringify(getMessages))

//   // keep track of the connection
//   connections.push(stream)

//   // when the connection closes, stop keeping track of it
//   stream.on('close', () => {
//     connections = connections.filter((s) => s !== stream)
//   })
// })
// const http2Server = http2.createSecureServer({
//   key: readFileSync(KEY_PATH),
//   cert: readFileSync(CERT_PATH),
//   allowHTTP1: true,
//   // },
//   // (req, res) => {
//   //   const {
//   //     //@ts-ignore
//   //     socket: { alpnProtocol },
//   //   } = req.httpVersion === '2.0' ? req.stream.session : req

//   //   res.writeHead(200, { 'content-type': 'application/json' })
//   //   res.end(
//   //     JSON.stringify({
//   //       alpnProtocol,
//   //       httpVersion: req.httpVersion,
//   //     }),
//   //   )
// })

// http2Server.on('stream', (stream, headers) => {
//   const method = headers[':method']
//   const path = headers[':path']
//   if (path === '/api/messages' && method === 'GET') {
//     stream.respond({
//       ':status': 200,
//       'content-type': 'text/plain; charset=utf-8',
//     })
//     stream.write(JSON.stringify(getMessages()))
//   } else {
//     stream.end({
//       ':status': 404,
//       'content-type': 'text/plain; charset=utf-8',
//     })
//   }
//   // keep track of the connection
//   connections.push(stream)

//   // when the connection closes, stop keeping track of it
//   stream.on('close', () => {
//     connections = connections.filter((s) => s !== stream)
//   })
// })

// // http2Server.on('stream', (stream, headers) => {
// //   const method = headers[':method']
// //   const path = headers[':path']

// //   // streams will open for everything, we want just GETs on /msgs
// //   if (path === '/api/messages' && method === 'GET') {
// //     // immediately respond with 200 OK and encoding
// //     stream.respond({
// //       ':status': 200,
// //       'content-type': 'text/plain; charset=utf-8',
// //     })

// //     // write the first response
// //     stream.write(JSON.stringify(getMessages))

// //     // keep track of the connection
// //     connections.push(stream)

// //     // when the connection closes, stop keeping track of it
// //     stream.on('close', () => {
// //       connections = connections.filter((s) => s !== stream)
// //     })
// //   }
// // })

// http2Server.on('request', async (req, res) => {
//   const path = req.headers[':path']
//   const method = req.headers[':method']

//   if (path !== '/api/messages') {
//     // handle the static assets
//     res.end()
//   }
//   if (method === 'POST') {
//     // get data out of post
//     const buffers = []
//     for await (const chunk of req) {
//       buffers.push(chunk)
//     }
//     const data = Buffer.concat(buffers).toString()
//     const { username, message } = JSON.parse(data)
//     pushMessage({ username, message })

//     // all done with the request
//     res.end()

//     // notify all connected users
//     connections.forEach((stream) => {
//       stream.write(JSON.stringify(getMessages()))
//     })
//   } else {
//     res.end()
//   }
// })

// http2Server.on('error', (err) => console.error(err))

// http2Server.listen(port, () =>
//   console.log(`Server running at https://localhost:${port} - make sure you're on httpS, not http`),
// )
