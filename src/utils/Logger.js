export class Logger {
  static LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
  };

  static COLORS = {
    DEBUG: "#808080", 
    INFO: "#0000FF",  
    WARN: "#FFA500",    
    ERROR: "#FF0000", 
  };

  constructor(module) {
    this.module = module;
    this.logLevel = Logger.LOG_LEVELS.DEBUG;
  }

  formatMessage(level, message, details = {}) {
    const timestamp = new Date().toISOString();
    const detailsStr = Object.keys(details).length
      ? " - " + Object.entries(details)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")
      : "";

    return `${timestamp} [${level}] [${this.module}] ${message}${detailsStr}`;
  }

  appendToFile(logEntry) {
    const level = logEntry.split("[")[1].split("]")[0];
    const style = `color: ${Logger.COLORS[level]}; font-weight: ${
      level === "ERROR" ? "bold" : "normal"
    }`;
    console.log("%c" + logEntry, style);
  }

  debug(message, details = {}) {
    if (this.logLevel <= Logger.LOG_LEVELS.DEBUG) {
      const logEntry = this.formatMessage("DEBUG", message, details);
      this.appendToFile(logEntry);
    }
  }

  info(message, details = {}) {
    if (this.logLevel <= Logger.LOG_LEVELS.INFO) {
      const logEntry = this.formatMessage("INFO", message, details);
      this.appendToFile(logEntry);
    }
  }

  warn(message, details = {}) {
    if (this.logLevel <= Logger.LOG_LEVELS.WARN) {
      const logEntry = this.formatMessage("WARN", message, details);
      this.appendToFile(logEntry);
    }
  }

  error(message, details = {}) {
    if (this.logLevel <= Logger.LOG_LEVELS.ERROR) {
      const logEntry = this.formatMessage("ERROR", message, details);
      this.appendToFile(logEntry);
    }
  }

  static getLogger(module) {
    return new Logger(module);
  }
}
