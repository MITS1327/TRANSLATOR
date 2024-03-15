import { BadRequestException, NotFoundException } from '@nestjs/common';

import * as lodash from 'lodash';
import {
  Between,
  EntityManager,
  EntityTarget,
  Equal,
  FindOperator,
  FindOptionsOrder,
  FindOptionsOrderValue,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  Like,
  Not,
  Raw,
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
import { OperandTypeEnum } from '../enums';
import { DeepPartial, FilterOptions, Operand, OptionalDeepPartial } from '../types';

export abstract class BaseRepositoryImpl<T extends BaseEntity> implements BaseRepository<T> {
  protected repo: Repository<T>;
  protected DEFAULT_LIMIT = MAX_QUERY_LIMIT;
  protected DEFAULT_OFFSET = 0;
  protected DEFAULT_ORDER_BY: keyof T = 'id';
  protected DEFAULT_SORT_DIRECTION: OrderValue = 'ASC';

  private readonly fields = [];
  constructor(
    private target: EntityTarget<T>,
    private manager: EntityManager,
  ) {
    this.repo = manager.getRepository(target);
    this.fields = [...this.repo.metadata.columns.map((columnMetadata) => columnMetadata.propertyPath)];
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

  async getCountBy(filter: FilterOptions<T>): Promise<number> {
    return this.repo.countBy(filter as FindOptionsWhere<T>);
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

  private isColumnExistOrThrow(column: string): boolean {
    if (!this.fields.includes(column.toString())) {
      throw new BadRequestException(`Property '${column.toString()}' was not found in '${this.repo.metadata.name}'`);
    }

    return true;
  }

  private getColumnAliasByPropertyPath(path: string) {
    const columnMetadata = this.repo.metadata.findColumnsWithPropertyPath(path)[0];

    if (!columnMetadata) {
      throw new BadRequestException(`Field by path ${path} not found`);
    }

    return `"${columnMetadata.entityMetadata.name}"."${columnMetadata.propertyAliasName}"`;
  }

  private getTypeOrmFindOperator(operands: string[], operator: FilterConditionEnum) {
    const OPERAND_REFERENCED_TO_COLUMN_PREFIX = '$';
    const mappedOperands = operands.map((operand) => {
      if (operand.startsWith(OPERAND_REFERENCED_TO_COLUMN_PREFIX)) {
        return {
          type: OperandTypeEnum.COLUMN,
          value: this.getColumnAliasByPropertyPath(operand.replace(OPERAND_REFERENCED_TO_COLUMN_PREFIX, '')),
        };
      }

      return {
        type: OperandTypeEnum.VALUE,
        value: operand,
      };
    });

    const plainOperatorToOrmOperator: Record<FilterConditionEnum, (operands: Operand[]) => FindOperator<unknown>> = {
      [FilterConditionEnum.$BETWEEN]: (operands) => Between(operands[0].value, operands[1].value),
      [FilterConditionEnum.$EQ]: (operands) => {
        const filterOperator =
          operands[0].type === 'value'
            ? Equal(operands[0].value)
            : Raw((columnAlias) => `${columnAlias} = ${operands[0].value}`);

        return operands[0].value === 'null' ? IsNull() : filterOperator;
      },
      [FilterConditionEnum.$LIKE]: (operands) => Like(`%${operands[0]}%`),
      [FilterConditionEnum.$ILIKE]: (operands) => ILike(`%${operands[0]}%`),
      [FilterConditionEnum.$IN]: (operands) => In(operands.map((operand) => operand.value)),
      [FilterConditionEnum.$NOT_EQ]: (operands) => {
        const filterOperator =
          operands[0].type === 'value'
            ? Not(operands[0].value)
            : Raw((columnAlias) => `${columnAlias} != ${operands[0].value}`);

        return operands[0].value === 'null' ? IsNull() : filterOperator;
      },
    };

    return plainOperatorToOrmOperator[operator](mappedOperands);
  }

  filterBuilder(filter: FilterQueryInputObject<T>[][]): FilterOptions<T> {
    if (!filter) {
      return {};
    }

    return filter.map((filterItem) => {
      const result = {};

      filterItem.map((item) => {
        this.isColumnExistOrThrow(item.field.toString());
        lodash.set(result, item.field, this.getTypeOrmFindOperator(item.operands, item.operator));
      });

      return result;
    });
  }

  async countBy(filter: FilterOptions<T>): Promise<number> {
    return this.repo.countBy(filter as FindOptionsWhere<T>);
  }
}
