import { NextRequest, NextResponse } from "next/server";
import { AppError } from "./errors";
import { ZodError } from "zod";

type RouteHandler = (req: NextRequest, ctx: any) => Promise<NextResponse>;

export function withErrorHandling(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: err.flatten() },
          { status: 400 },
        );
      }

      if (err instanceof AppError) {
        if (!err.isOperational) {
          console.error("[Unexpected AppError]", err);
        }
        return NextResponse.json(
          { error: err.message },
          { status: err.statusCode },
        );
      }

      console.error("[Unhandled error]", err);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }
  };
}
