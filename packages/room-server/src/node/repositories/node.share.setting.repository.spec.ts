/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { DatabaseConfigService } from 'shared/services/config/database.config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepPartial } from 'typeorm';
import { NodeShareSettingRepository } from './node.share.setting.repository';
import { NodeShareSettingEntity } from '../entities/node.share.setting.entity';

describe('Test NodeShareSettingRepository', () => {
  let module: TestingModule;
  let repository: NodeShareSettingRepository;
  let entity: NodeShareSettingEntity;

  beforeAll(async() => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigService,
        }),
        TypeOrmModule.forFeature([NodeShareSettingRepository]),
      ],
    }).compile();
    repository = module.get<NodeShareSettingRepository>(NodeShareSettingRepository);
  });

  beforeEach(async() => {
    const nodeShareSetting: DeepPartial<NodeShareSettingEntity> = {
      id: '2023',
      nodeId: 'datasheetId',
      shareId: 'shareId',
      isEnabled: true,
      allowSave: true,
    };
    const record = repository.create(nodeShareSetting);
    entity = await repository.save(record);
  });

  afterEach(async() => {
    await repository.delete(entity.id);
  });

  afterAll(async() => {
    await repository.manager.connection.close();
  });

  it('should be return share setting by share id', async() => {
    const shareSetting = await repository.selectByShareId('shareId');
    expect(shareSetting?.nodeId).toEqual('datasheetId');
  });

  it('should be return share setting by node id', async() => {
    const shareSetting = await repository.selectByNodeId('datasheetId');
    expect(shareSetting?.shareId).toEqual('shareId');
  });
});
