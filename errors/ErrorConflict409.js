class ErrorConflict409 extends Error {
  constructor(message) {
    super();
    this.status = 409;
    this.message = message;
  }
}

module.exports = ErrorConflict409;
