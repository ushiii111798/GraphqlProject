import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as moment from 'moment';
import 'moment-timezone';
const logDir = 'logs';
const { combine, timestamp, printf } = winston.format;

const logFormat2 = printf((info) => {
  const date = moment().tz('Asia/Seoul');
  return `${date.format()} ${info.level}: "${info.message}"`;
});

export const apiPlainLogger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat2,
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/api/info',
      filename: `%DATE%.log`,
      maxSize: '300m',
      maxFiles: 30,
      zippedArchive: true,
    }),
    new winston.transports.DailyRotateFile({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/api/error',
      filename: `%DATE%.error.log`,
      maxSize: '300m',
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

// Production 환경이 아닌 경우(dev 등)
if (process.env.NODE_ENV !== 'production') {
  apiPlainLogger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}
