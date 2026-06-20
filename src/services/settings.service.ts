import { settingsRepository } from '@/repositories/settings.repository'
import type { StoreSettingsDTO } from '@/types'
import type { UpdateSettingsInput } from '@/validations/settings.schema'

export const settingsService = {
  async get(domain: string): Promise<StoreSettingsDTO | null> {
    return settingsRepository.getByDomain(domain)
  },

  async update(input: UpdateSettingsInput, domain: string): Promise<StoreSettingsDTO> {
    return settingsRepository.upsert(input, domain)
  },
}
