import { settingsRepository } from '@/repositories/settings.repository'
import type { StoreSettingsDTO } from '@/types'
import type { UpdateSettingsInput } from '@/validations/settings.schema'

export const settingsService = {
  async get(): Promise<StoreSettingsDTO | null> {
    return settingsRepository.get()
  },

  async update(input: UpdateSettingsInput): Promise<StoreSettingsDTO> {
    return settingsRepository.upsert(input)
  },
}
