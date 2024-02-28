import { BadRequestException, NotFoundException } from '@nestjs/common';

import * as lodash from 'lodash';
import {
  Between,
  EntityManager,
  EntityTarget,
  Equal,
  FindOptionsOrder,
  FindOptionsOrderValue,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  Like,
  Not,
  Repository,
} from 'typeorm';
import { IsolationLevel, Transactional } from 'typeorm-transactional';

import {
  BaseEntity,
  FilterConditionEnum,
  FilterQueryInputObject,
  GetDataWithFilterOutputObject,
  OrderValue,
} from '../../core';
import { MAX_QUERY_LIMIT } from '../../core/constants';
import { BaseRepository } from '../base.repository.interface';
import { DeepPartial, FilterOptions, OptionalDeepPartial } from '../types';

export abstract class BaseRepositoryImpl<T extends BaseEntity> implements BaseRepository<T> {
  protected repo: Repository<T>;
  protected DEFAULT_LIMIT = MAX_QUERY_LIMIT;
  protected DEFAULT_OFFSET = 0;
  protected DEFAULT_ORDER_BY: keyof T = 'id';
  protected DEFAULT_SORT_DIRECTION: OrderValue = 'ASC';

  constructor(
    private target: EntityTarget<T>,
    private manager: EntityManager,
  ) {
    this.repo = manager.getRepository(target);
  }

  async getOneById(id: T['id']): Promise<T> {
    return this.getOneBy({ id } as FilterOptions<T>);
  }

  async getOneBy(filter: FilterOptions<T>): Promise<T> {
    const entry = await this.repo.findOneBy(filter as FindOptionsWhere<T>);

    if (!entry) {
      return null;
    }

    return entry;
  }

  async getManyBy(filter: FilterOptions<T>): Promise<T[]> {
    return this.repo.findBy(filter as FindOptionsWhere<T>);
  }

  protected getSortObject(orderBy: FindOptionsOrderValue, sortBy: keyof T) {
    const sortObject: FindOptionsOrder<T> = {};
    lodash.set(sortObject, sortBy, orderBy);

    return sortObject;
  }

  async getWithLimitAndOffset(
    filter: FilterOptions<T>,
    limit: number = this.DEFAULT_LIMIT,
    offset: number = this.DEFAULT_OFFSET,
    orderBy: OrderValue = this.DEFAULT_SORT_DIRECTION,
    sortBy: keyof T = this.DEFAULT_ORDER_BY,
  ): Promise<GetDataWithFilterOutputObject<T>> {
    const [data, count] = await this.repo.findAndCount({
      where: filter as FindOptionsWhere<T> | FindOptionsWhere<T>[],
      skip: offset,
      take: limit,
      order: this.getSortObject(orderBy, sortBy),
    });

    return {
      data,
      limit,
      offset,
      totalCount: count,
    };
  }

  async getAll(): Promise<T[]> {
    return this.repo.find();
  }

  async create(data: DeepPartial<T>): Promise<void> {
    const newEntity = this.repo.create(data);
    await this.repo.save(newEntity);
  }

  async createWithReturnedEntity(data: DeepPartial<T>): Promise<T> {
    const newEntity = this.repo.create(data);
    await this.repo.save(newEntity);

    return this.getOneById(newEntity.id);
  }

  async createBulk(data: DeepPartial<T>[]): Promise<void> {
    const newEntities = this.repo.create(data);
    await this.repo.save(newEntities);
  }

  async updateOneById(id: T['id'], data: OptionalDeepPartial<T>): Promise<void> {
    await this.updateOneBy({ id } as FilterOptions<T>, data);
  }

  async updateOneBy(filter: FilterOptions<T>, data: OptionalDeepPartial<T>): Promise<void> {
    const entry = await this.getOneBy(filter);

    if (!entry) {
      throw new NotFoundException('Not found');
    }
    Object.assign(entry, data);

    await this.repo.save(entry);
  }

  @Transactional({ isolationLevel: IsolationLevel.READ_UNCOMMITTED })
  async replaceById(id: T['id'], data: DeepPartial<T>) {
    await this.deleteById(id);
    await this.create(data);
  }

  async deleteBy(filter: FilterOptions<T>) {
    await this.repo.delete(filter as FindOptionsWhere<T>);
  }

  async deleteById(id: T['id']) {
    await this.deleteBy({ id } as FilterOptions<T>);
  }

  filterBuilder(data: FilterQueryInputObject<T>[]): FilterOptions<T> {
    if (!data) {
      return {};
    }
    const fields = [...this.repo.metadata.columns.map((columnMetadata) => columnMetadata.propertyPath)];

    const result = {};
    data.forEach((item) => {
      if (!fields.includes(item.field.toString())) {
        throw new BadRequestException(
          `Property '${item.field.toString()}' was not found in '${this.repo.metadata.name}'`,
        );
      }
      const field = item.field;

      const operands = item.operands;

      switch (item.operator) {
        case FilterConditionEnum.$BETWEEN:
          lodash.set(result, field, Between(operands[0], operands[1]));
          break;
        case FilterConditionEnum.$EQ:
          lodash.set(result, field, operands[0] === 'null' ? IsNull() : Equal(operands[0]));
          break;
        case FilterConditionEnum.$LIKE:
          lodash.set(result, field, Like(`%${operands[0]}%`));
          break;
        case FilterConditionEnum.$ILIKE:
          lodash.set(result, field, ILike(`%${operands[0]}%`));
          break;
        case FilterConditionEnum.$IN:
          lodash.set(result, field, In(operands));
          break;
        case FilterConditionEnum.$NOT_EQ:
          lodash.set(result, field, operands[0] === 'null' ? Not(IsNull()) : Not(operands[0]));
          break;
      }
    });

    return result;
  }

  async countBy(filter: FilterOptions<T>): Promise<number> {
    return this.repo.countBy(filter as FindOptionsWhere<T>);
  }
}
