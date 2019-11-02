export default class Timer {

  constructor ({
    duration,
    interval = 1000,
    ontick = (() => {}),
    onpause = (() => {}),
    onunpause = (() => {}),
    callback = (() => {}),
    alwaysRunCallback = false,
    runCallbackOnStart = true,
    autoStart = true,
    loop = false
  }) {

    this._totalDuration = duration
    this._interval = interval
    this._ontick = ontick
    this._onpause = onpause
    this._onunpause = onunpause
    this._callback = callback
    this._alwaysRunCallback = alwaysRunCallback
    this._runCallbackOnStart = runCallbackOnStart
    this._autoStart = autoStart
    this._loop = loop

    this.init()
  }

  init () {
    this._isStarted = false
    this._isStopped = false
    this._isFinished = false
    this._isRunning = false
    this._isPaused = false
    this._remainingDuration = this._totalDuration
    this._pastDuration = 0
    this._timer = null

    if (this._autoStart) this.start()
  }

  reset () {
    clearInterval(this._timer)
    this._timer = null
    this._isStarted = false
    this._isStopped = false
    this._isFinished = false
    this._isRunning = false
    this._isPaused = false
    this._remainingDuration = this._totalDuration
    this._pastDuration = 0
  }

  start () {
    if (this._isPaused && this._isRunning) {
      this._isPaused = false
      this._timer = setInterval(() => {
        this._tick()
      }, this._interval)
      this._onunpause(this)
      return
    }

    this._isStarted = true
    this._isRunning = true
    if (this._runCallbackOnStart) this._ontick(this, true)
    this._timer = setInterval(() => {
      this._tick()
    }, this._interval)
  }

  pause () {
    this._isPaused = true
    clearInterval(this._timer)
    this._onpause(this)
  }

  unpause () {
    this._isPaused = false
    this._timer = setInterval(() => {
      this._tick()
    }, this._interval)
    this._onunpause(this)
  }

  stop () {
    clearInterval(this._timer)
    this._isStopped = true
    this._isRunning = false
    if (this._alwaysRunCallback || this._isFinished) this._callback(this)
  }

  _tick () {
    if (this._isPaused) return

    if (!this._loop) {
      if (this._remainingDuration <= 0) {
        this._isFinished = true
        this.stop()
        return
      }
      this._remainingDuration -= this._interval
    }
    
    this._pastDuration += this._interval
    this._ontick(this)
  }

  set interval (value) {
    this._interval = value
  }
  
  set duration (value) {
    this._totalDuration = value
  }

  set ontick (func) {
    this._ontick = func
  }

  set onpause (func) {
    this._onpause = func
  }

  set onunpause (func) {
    this._onunpause = func
  }

  get isStarted () {
    return this._isStarted
  }

  get isStopped () {
    return this._isStopped
  }

  get isFinished () {
    return this._isFinished
  }

  get isRunning () {
    return this._isRunning
  }

  get isPaused () {
    return this._isPaused
  }

  set pastDuration (value) {
    if (value > this._totalDuration) return false
    this._pastDuration = value
    this._remainingDuration = this._totalDuration - this._pastDuration
  }

  get pastDuration () {
    return this._pastDuration
  }

  set remainingDuration (value) {
    if (value > this._totalDuration) return false
    this._remainingDuration = value
    this._pastDuration = this._totalDuration - this._remainingDuration
  }

  get remainingDuration () {
    return this._remainingDuration
  }
