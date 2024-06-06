import { HEARTBEAT } from '@/constant/const'

interface Options {
  onMessage?(event: MessageEvent): void // 接受数据成功的回调
  onClose?(): void // 关闭连接时的回调
  onError?(): void // 连接错误时的回调
  onOpen?(): void // 连接成功时的回调
  onReconnect?(): void // 重连成功时的回调
  onReconnectFail?(): void // 重连失败时的回调
  pingTimeout?: number // 重新连接，发送心跳的周期
  pongTimeout?: number // 心跳等待时间
  reconnectTimeout?: number // 重新连接时间
  pingMsg?: string // 和后台预约的心跳参数
  repeatLimit?: number // 重连次数限制
}

type OptionsThis<T> = {
  [P in keyof T]-?: T[P]
}

const baseURL = '/ws'

export default class WS {
  private repeat: number
  private lockReconnect: boolean
  private forbidReconnect: boolean
  private pingTimeoutId: number
  private pongTimeoutId: number
  private options: OptionsThis<Options>
  private instance: WebSocket | null
  constructor(
    private url: string,
    options: Options
  ) {
    const token = localStorage.getItem('token')
    const timestamp = new Date().getTime()
    const locUrl = `ws://${window.location.host}${baseURL}`
    this.url = `${
      import.meta.env.VITE_API_WEBSOCKET_URL || locUrl
    }${url}/${timestamp}?token=${token}`
    this.options = {
      onMessage: () => {
        // onMessage
      },
      onClose: () => {
        // onClose
      },
      onError: () => {
        // onError
      },
      onOpen: () => {
        // onOpen
      },
      onReconnect: () => {
        // onReconnect
      },
      onReconnectFail: () => {
        // onReconnectFail
      },
      pingTimeout: 30000,
      pongTimeout: 10000,
      reconnectTimeout: 2000,
      pingMsg: HEARTBEAT,
      repeatLimit: 10,
      ...options
    }
    this.repeat = 0
    this.instance = null
    this.lockReconnect = false
    this.forbidReconnect = false
    this.pingTimeoutId = 0
    this.pongTimeoutId = 0
    this._createWebSocket()
  }

  _createWebSocket(): void {
    try {
      this.instance = new WebSocket(this.url)
      this._initEventHandle()
    } catch (e) {
      this._reconnect()
      throw e
    }
  }

  _initEventHandle(): void {
    this.instance!.onclose = () => {
      this.options.onClose()
      this._reconnect()
    }
    this.instance!.onerror = (e) => {
      this.options.onError()
      console.log(e)
      this._reconnect()
    }
    this.instance!.onopen = () => {
      this.options.onOpen()
      this.send(this.options.pingMsg)
      this._heartReset()
    }
    this.instance!.onmessage = (event) => {
      if (event && event.data !== HEARTBEAT) {
        this.options.onMessage(event)
      }
      this._heartStart()
    }
  }

  _reconnect(): void {
    const repeatLimit = this.options.repeatLimit
    if (repeatLimit > 0 && repeatLimit <= this.repeat) {
      this.options.onReconnectFail()
      return
    }
    if (this.lockReconnect || this.forbidReconnect) {
      return
    }
    this.lockReconnect = true
    this.repeat++
    this.options.onReconnect()
    setTimeout(() => {
      this._createWebSocket()
      this.lockReconnect = false
    }, this.options.reconnectTimeout)
  }

  _heartReset(): void {
    // 不再重连就不再执行心跳
    if (this.forbidReconnect) {
      return
    }
    // 发送一个心跳，后端收到后，返回一个心跳消息，onmessage拿到返回的心跳就说明连接正常
    this.pingTimeoutId = window.setTimeout(() => {
      this.send(this.options.pingMsg)
      // 超过一定时间还没重置，说明后端主动断开了
      this.pongTimeoutId = window.setTimeout(() => {
        // onclose会执行reconnect，我们执行instance.close()就行了。直接执行reconnect会触发onclose导致重连两次
        this.instance!.close()
      }, this.options.pongTimeout)
    }, this.options.pingTimeout)
  }

  // onopen连接上，就开始start计时，如果在定时时间范围内，onmessage获取到了服务端消息，就重置reset倒计时，距离上次从后端获取消息30秒后，执行心跳检测，看是不是断了。
  _heartStart(): void {
    this._heartClear()
    this._heartReset()
  }

  // 清除心跳
  _heartClear(): void {
    clearTimeout(this.pingTimeoutId)
    clearTimeout(this.pongTimeoutId)
  }

  send(message: string): void {
    this.instance!.send(message)
  }

  close(): void {
    this.forbidReconnect = true // 手动关闭连接，不再重连
    this.instance!.close()
    this._heartClear()
  }
}
