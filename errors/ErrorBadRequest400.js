class ErrorBadRequest400 extends Error {
  constructor(message) {
    super();
    this.status = 400;
    this.message = message;
  }
}

module.exports = ErrorBadRequest400;
