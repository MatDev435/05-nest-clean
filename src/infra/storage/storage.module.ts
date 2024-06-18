import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { Uploader } from '@/domain/forum/application/storage/uploader'
import { R2Storage } from './rs-storage'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
