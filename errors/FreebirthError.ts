export class FreebirthError extends Error {
    statusCode;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

const createFreebirthError = (msg: string) => {
    return new FreebirthError(msg, 420);
};

export default createFreebirthError;
