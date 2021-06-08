export class AppError {
  constructor(statusCode, message) {
    this.statusCode = statusCode
    this.message = message
  }
}
