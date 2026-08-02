export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public isOperational = true,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Not authenticated") {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Not authorized") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}
