import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Point, POINT_STATUS_ENUM } from './entities/point.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly connection: Connection,
  ) {}

  async create({ name, point, user }) {
    const pointCreation = this.pointRepository.create({
      name,
      point,
      user,
      status: POINT_STATUS_ENUM.CREDIT,
    });
    const result = await this.pointRepository.save(pointCreation);
    return result;
  }

  async cancel({ name, point, user }) {
    const pointCreation = this.pointRepository.create({
      name,
      point,
      status: POINT_STATUS_ENUM.CANCEL,
      user,
    });
    const result = await this.pointRepository.save(pointCreation);
    return result;
  }

  async updatePointTotal(userid) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { activePoint } = await this.pointRepository
        .createQueryBuilder('point')
        .select('SUM(point.point)', 'activePoint')
        .where('point.user = :user', { user: userid })
        .getRawOne();
      console.log('activePoint : ', activePoint);
      await queryRunner.manager.findOne(User, {
        where: { id: userid },
        lock: { mode: 'pessimistic_write' },
      });
      await queryRunner.manager.update(
        User,
        { id: userid },
        { pointTotal: activePoint },
      );

      await queryRunner.commitTransaction();

      return activePoint;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
