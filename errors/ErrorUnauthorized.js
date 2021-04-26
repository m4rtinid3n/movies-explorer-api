class ErrorUnauthorized extends Error {
  constructor(message) {
    super();
    this.status = 401;
    this.message = message;
  }
}

module.exports = ErrorUnauthorized;
