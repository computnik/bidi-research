import Fastify from 'fastify'
import { IncomingMessage, ServerResponse } from 'http'
import { Http2ServerRequest, Http2ServerResponse } from 'http2'
import fastifyStatic from '@fastify/static'
import { readFileSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import LRU from 'lru-cache'
import fastifySocketIO from 'fastify-socket.io'
import { FastifySSEPlugin as fastifySSEPlugin } from 'fastify-sse-v2'

import { getMessages, pushMessage, Message } from './messages'
import { FETCH_MESSAGE_EVENT, MessageEmitter, RECEIVE_MESSAGE_EVENT } from './messages/message-events'
import { on } from 'events'
/** ENV Variables **/
const port: number = Number(process.env.PORT) || 8001
const PROD = process.env.NODE_ENV === 'production'

/** File Paths **/
const KEY_PATH = path.resolve('certs/key.pem')
const CERT_PATH = path.resolve('certs/server.crt')
const STATIC_FILES_PATH = path.resolve('dist')

// /** Configuring Fastify HTTP/2 Server **/
const fastify = Fastify({
  logger: true,
  http2: true,
  https: {
    key: readFileSync(KEY_PATH),
    cert: readFileSync(CERT_PATH),
    allowHTTP1: true,
  },
})

/** Long Polling Setup **/
fastify.get('/api/poll', (req, reply) => {
  reply.code(200).type('application/json; charset=utf-8').send(getMessages())
})
fastify.post('/api/poll', (req, reply) => {
  const { username, message } = req.body as Message
  pushMessage({ username, message })
  reply.code(200).type('application/json').send({ status: 'ok' })
})

/** Long Polling **/
let longPollConnections = new LRU<string, any>({ max: 20 })
fastify.post('/api/long-poll', (req, reply) => {
  const { username, message } = req.body as Message
  pushMessage({ username, message })
  const messages = getMessages()
  reply.code(200).type('application/json').send({ status: 'ok' })
  for (let [clientId, { offset, reply }] of longPollConnections.entries()) {
    if (offset < messages.length) {
      reply.raw.write(JSON.stringify(messages))
      reply.raw.end()
      longPollConnections.delete(clientId)
    }
  }
})

fastify.get('/api/long-poll', (req, reply) => {
  //@ts-ignore
  const offset: number = Number(req.query?.offset ?? '0')
  //@ts-ignore
  const clientId = req.query?.clientId ?? uuidv4()
  const messages = getMessages()
  if (offset < messages.length) {
    reply.code(200).type('application/json').send(messages)
  } else {
    reply.raw.writeHead(200, { 'Content-Type': 'application/json' })
    longPollConnections.set(clientId, { offset, reply })
  }
  req.raw.on('close', () => {
    longPollConnections.delete(clientId)
  })
})

/** HTTP/2 Push **/
let http2Connections: any[] = []

export type RawRequest = IncomingMessage | Http2ServerRequest
export type RawResponse = ServerResponse | Http2ServerResponse

function isHttp2Request(req: RawRequest): req is Http2ServerRequest {
  return !!(req as Http2ServerRequest).stream
}

function isHttp2Response(res: RawResponse): res is Http2ServerResponse {
  return !!(res as Http2ServerResponse).stream
}

fastify.get('/api/http2-push', (req, reply) => {
  const rawRequest = req.raw
  if (isHttp2Request(rawRequest)) {
    const reqStream = rawRequest.stream
    reqStream.on('pushError', (err) => {
      req.log!.error('Error while pushing', err)
    })
    reqStream.respond({
      ':status': 200,
      'content-type': 'text/plain; charset=utf-8',
    })
    // write the first response
    reqStream.write(JSON.stringify(getMessages()))

    // keep track of the connection
    http2Connections.push(reqStream)
    // when the connection closes, stop keeping track of it
    reqStream.on('close', () => {
      http2Connections = http2Connections.filter((s) => s !== reqStream)
    })
  } else {
    reply.status(200).send([])
  }
})

fastify.post('/api/http2-push', async (req, reply) => {
  const rawRequest = req.raw
  const rawResponse = reply.raw

  if (isHttp2Request(rawRequest)) {
    // read data out of request
    // const buffers = []
    // for await (const chunk of rawRequest) {
    //   buffers.push(chunk)
    // }
    // const data = Buffer.concat(buffers).toString()
    // const { username, message } = JSON.parse(data)
    const { username, message } = req.body as Message
    pushMessage({ username, message })

    // all done with the request
    rawResponse.end()

    // notify all connected users
    http2Connections.forEach((stream) => {
      stream.write(JSON.stringify(getMessages()))
    })
  } else {
    reply.status(200).send()
  }
})

/** SSE (Server Sent Events) **/
const sseClientPool = new LRU({ max: 20 })
fastify.register(fastifySSEPlugin, {
  prefix: '/sse',
})

fastify.get('/api/sse', (req, reply) => {
  const messages = getMessages()
  reply.sse(
    (async function* () {
      yield {
        type: FETCH_MESSAGE_EVENT,
        data: JSON.stringify(messages),
      }
      for await (const event of on(MessageEmitter, RECEIVE_MESSAGE_EVENT)) {
        console.log(JSON.stringify(event))
        yield {
          type: event.name,
          data: JSON.stringify(getMessages()),
        }
      }
    })(),
  )
})

fastify.post('/api/sse', async (req, reply) => {
  const { username, message } = req.body as Message
  pushMessage({ username, message })
  reply.status(200).send()
})

/** Socket.io Websockets **/
fastify.register(fastifySocketIO, {
  prefix: '/socket-io',
})

fastify.ready((err) => {
  if (err) {
    throw err
  }
  fastify.io.on('connection', (socket) => {
    // @TODO: use client_id instead
    console.log(`connected: ${socket.id}`)

    socket.on('messages:fetch', () => {
      socket.emit('messages:get', getMessages())
    })

    // socket.emit('messages:get', { messages: getMessages() })

    socket.on('messages:post', (data) => {
      const { username, message } = data
      pushMessage({ username, message })
      fastify.io.emit('messages:get', getMessages())
    })

    socket.on('disconnect', () => {
      console.log(`disconnect: ${socket.id}`)
    })
  })
})

/** Serving Static Assets **/
fastify.register(fastifyStatic, {
  root: STATIC_FILES_PATH,
  prefix: '/',
})

/** Starting the Fastify Server **/
const start = async () => {
  try {
    await fastify.listen(port)
    console.log(`\n\n🚀 Fastify-Server running at https://localhost:${port}.\n\n`)
  } catch (err) {
    fastify.log.error(err)
    console.error(err)
    process.exit(1)
  }
}
start()
