import create, { StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Body, SystemOrbit, Spacecraft, System } from '@othrworld/core'
import { generateDebugSystem } from '@othrworld/systemgen'
import {
  getCarthesianCoords,
  OrbitManeuver,
} from '@othrworld/orbital-mechanics'
import { sumUnits } from '@othrworld/units'

type SystemState = {
  system: System
  setSystem: (s: System) => void
  getBody: (bodyId: Body['id']) => Body | undefined
  getSpacecraft: (spacecraftId: Spacecraft['id']) => Spacecraft | undefined
  setSpacecraft: (
    spacecraftId: Spacecraft['id'],
    setter: (s: Spacecraft) => Spacecraft
  ) => void
  setSpacecraftManeuvers: (
    sId: Spacecraft['id'],
    maneuvers: OrbitManeuver[]
  ) => void
}

const stateCreator: StateCreator<SystemState> = (set, get) => ({
  system: generateDebugSystem(),
  setSystem: (system) => set({ system }),
  setSpacecraft: (sId, setter) => {
    const { system: s } = get()
    const spacecraftIndex = s.spacecrafts.findIndex((sp) => sp.id === sId)
    set({
      system: {
        ...s,
        spacecrafts: [
          ...s.spacecrafts.slice(0, spacecraftIndex),
          setter(s.spacecrafts[spacecraftIndex]),
          ...s.spacecrafts.slice(spacecraftIndex + 1),
        ],
      },
    })
  },
  setSpacecraftManeuvers: (sId, maneuvers) =>
    get().setSpacecraft(sId, (s) => ({ ...s, maneuvers })),

  getBody: (bId) => get().system.bodies.find(({ id }) => id === bId),
  getSpacecraft: (sId) => get().system.spacecrafts.find(({ id }) => id === sId),
})

export const useSystemStore = create(devtools(stateCreator, 'system'))

const getParentBody = (orbit: SystemOrbit): Body | undefined =>
  useSystemStore
    .getState()
    .system.bodies.find(({ id }) => id === orbit.parentId)

/** Returns an array of parent orbits, from the outermost item. Includes the current orbit at the end */
const getOrbitPath = (orbit: SystemOrbit): SystemOrbit[] => {
  const parentBody = getParentBody(orbit)
  if (parentBody && !(parentBody.type === 'star')) {
    return [...getOrbitPath(parentBody.orbit), orbit]
  }
  return [orbit]
}

/** Returns the absolute coordinates of an orbital element */
export const getAbsoluteCoords = (orbit: SystemOrbit, t: Date) => {
  const path = getOrbitPath(orbit)
  const coords = path.map((orbit) => getCarthesianCoords(orbit, t))

  return coords.reduce((coord1, coord2) => {
    return { x: sumUnits(coord1.x, coord2.x), y: sumUnits(coord1.y, coord2.y) }
  })
}
