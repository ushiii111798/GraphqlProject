import { PointService } from './point.service';
import { Resolver } from '@nestjs/graphql';

@Resolver()
export class PointResolver {
  constructor(private readonly pointService: PointService) {}
}
