import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface ICurrentUser {
  id?: string;
  loginId?: string;
  name?: string;
  loginPass?: string;
  birth?: Date;
  sex?: string;
  grade?: string;
  pointTotal?: number;
  email?: string;
}

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
