class apiResponce {
  constructor (statusCode, data, message = 'Success') {
    this.data = data
    this.statusCode = statusCode
    this.message = message
    this.success = statusCode < 400 // true false ke liye
  }
}

export { apiResponce }
