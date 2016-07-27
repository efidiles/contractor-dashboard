if (process.env.NODE_ENV === 'development') {
  let stopLogging = false;
  const _console = window.console;

  module.exports = prefix => {
    let moduleToLog;
    let filter;

    const shouldLog = (...args) => {
      let _shouldLog = true;
      const flattenMessage = args.join(' ');

      if (moduleToLog && !~moduleToLog.indexOf(prefix)) {
        _shouldLog = false;
      }

      if (filter && !~flattenMessage.indexOf(filter)) {
        _shouldLog = false;
      }

      if (stopLogging) {
        _shouldLog = false;
      }

      return _shouldLog;
    };

    if (process.env.LOG_MODULE) {
      moduleToLog = process.env.LOG_MODULE;
    }

    if (process.env.LOG_FILTER) {
      filter = process.env.LOG_FILTER;
    }

    return {
      debug: (...args) => {
        if (shouldLog(...args)) {
          _console.log(`%c${prefix}:`, 'color: green', ...args);
        }
      },

      info: (...args) => {
        if (shouldLog(...args)) {
          _console.info(`%c${prefix}:`, 'color: blue', ...args);
        }
      },

      warn: (...args) => {
        if (shouldLog(...args)) {
          _console.warn(`${prefix}:`, ...args);
        }
      },

      trace: (...args) => {
        if (shouldLog(...args)) {
          _console.log(`${prefix}:`, ...args);
        }
      },

      error: (...args) => {
        if (shouldLog(...args)) {
          _console.error(`${prefix}:`, ...args);
        }
      },

      only: (...args) => {
        stopLogging = true;
        _console.clear();
        _console.warn(`%c${prefix}:`, 'font-size: medium', ...args);
      }
    };
  };
} else {
  module.exports = () => { };
}
