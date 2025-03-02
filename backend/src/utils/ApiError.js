class ApiError extends Error {
    constructor(statusCode, message){
        super(message); // overide the message provided by Error Class with custom message
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
    }
}

export default ApiError;