import { isDebugEnable } from '@/common/debugEnable.js'

function createLogger(level = 'info') {
  const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
  const levelIndex = levels.indexOf(level)

  const levelColors = {
    trace: 'color: gray',
    debug: 'color: blue',
    info: 'color: green',
    warn: 'color: orange',
    error: 'color: red',
    fatal: 'color: magenta'
  }

  const logMethod = (method, ...args) => {
    if (levels.indexOf(method) >= levelIndex) {
      const color = levelColors[method]
      console.log(`%c[${method.toUpperCase()}]%c`, color, '', ...args)
    }
  }

  return {
    trace: (...args) => logMethod('trace', ...args),
    debug: (...args) => logMethod('debug', ...args),
    info: (...args) => logMethod('info', ...args),
    warn: (...args) => logMethod('warn', ...args),
    error: (...args) => logMethod('error', ...args),
    fatal: (...args) => logMethod('fatal', ...args)
  }
}

export const logger = createLogger(isDebugEnable ? 'debug' : 'info')
