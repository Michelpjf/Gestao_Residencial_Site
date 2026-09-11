export class AppError extends Error {
  constructor(status, code, message, options = {}) {
    super(message, options);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
  }
}
