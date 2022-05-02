import Home from "./pages/home";
import Polling from './pages/polling'
import LongPolling from './pages/long-polling'
import HTTP2Push from './pages/http2'
import ServerSideEvents from './pages/sse'
import WebSocketChat from './pages/websocket'
import NotFound from "./pages/not-found";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/polling',
    name: 'Polling',
    component: Polling,
  },
  {
    path: '/long-polling',
    name: 'Long Polling',
    component: LongPolling,
  },
  {
    path: '/http2-push',
    name: 'HTTP/2 Push',
    component: HTTP2Push,
  },
  {
    path: '/sse',
    name: 'Server Side Events',
    component: ServerSideEvents,
  },
  {
    path: '/websocket',
    name: 'Websocket',
    component: WebSocketChat,
  },
  {
    path: '*',
    component: NotFound,
  },
]

export default routes;