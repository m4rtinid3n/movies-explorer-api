class ErrorNotFound404 extends Error {
  constructor(message) {
    super();
    this.status = 404;
    this.message = message;
  }
}

module.exports = ErrorNotFound404;
