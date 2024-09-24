import { isDebugEnable } from './debugEnable.ts'

function createLogger(level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' = 'info') {
  const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const
  const levelIndex = levels.indexOf(level)

  const levelColors: { [key in typeof levels[number]]: string } = {
    trace: 'color: gray',
    debug: 'color: blue',
    info: 'color: green',
    warn: 'color: orange',
    error: 'color: red',
    fatal: 'color: magenta'
  }

  const logMethod = (method: typeof levels[number], ...args: unknown[]) => {
    if (levels.indexOf(method) >= levelIndex) {
      const color = levelColors[method]
      console.log(`%c[${method.toUpperCase()}]%c`, color, '', ...args)
    }
  }

  return {
    trace: (...args: unknown[]) => logMethod('trace', ...args),
    debug: (...args: unknown[]) => logMethod('debug', ...args),
    info: (...args: unknown[]) => logMethod('info', ...args),
    warn: (...args: unknown[]) => logMethod('warn', ...args),
    error: (...args: unknown[]) => logMethod('error', ...args),
    fatal: (...args: unknown[]) => logMethod('fatal', ...args)
  }
}

export const logger = createLogger(isDebugEnable ? 'debug' : 'info')
