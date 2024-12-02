import log4js from 'log4js';
import path from 'path';

// Konfigürasyon dosyasını yükle
log4js.configure(path.join(__dirname, '../../../log4js.config.json'));

// Logger'ı oluştur
export const logger = log4js.getLogger();

// İsteğe bağlı: Özel log seviyeleri için yardımcı metodlar
export const logHelper = {
  info: (message: string) => logger.info(message),
  debug: (message: string) => logger.debug(message),
  error: (message: string) => logger.error(message),
  warn: (message: string) => logger.warn(message)
};