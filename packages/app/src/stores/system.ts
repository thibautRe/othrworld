import create from 'zustand'
import { Spacecraft, System } from '@othrworld/core'
import { generateSystem } from '@othrworld/systemgen'

type SystemState = {
  system: System
  setSystem: (s: System) => void
  getSpacecraft: (spacecraftId: Spacecraft['id']) => Spacecraft | undefined
  setSpacecraft: (
    spacecraftId: Spacecraft['id'],
    spacecraft: Spacecraft
  ) => void
}

export const useSystemStore = create<SystemState>((set, get) => ({
  system: generateSystem(),
  setSystem: (system) => set({ system }),
  setSpacecraft: (sId, spacecraft) => {
    const { system: s } = get()
    const spacecraftIndex = s.spacecrafts.findIndex((sp) => sp.id === sId)
    set({
      system: {
        ...s,
        spacecrafts: [
          ...s.spacecrafts.slice(0, spacecraftIndex),
          spacecraft,
          ...s.spacecrafts.slice(spacecraftIndex + 1),
        ],
      },
    })
  },

  getSpacecraft: (sId) => get().system.spacecrafts.find(({ id }) => id === sId),
}))
