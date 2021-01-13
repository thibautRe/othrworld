import create from 'zustand'
import { Body, Orbit, Spacecraft, System } from '@othrworld/core'
import { generateSystem } from '@othrworld/systemgen'
import { getCarthesianCoords } from '@othrworld/orbital-mechanics'

type SystemState = {
  system: System
  setSystem: (s: System) => void
  getBody: (bodyId: Body['id']) => Body | undefined
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

  getBody: (bId) => get().system.bodies.find(({ id }) => id === bId),
  getSpacecraft: (sId) => get().system.spacecrafts.find(({ id }) => id === sId),
}))

const getParentBody = (orbit: Orbit): Body | undefined =>
  useSystemStore
    .getState()
    .system.bodies.find(({ id }) => id === orbit.parentId)

/** Returns an array of parent orbits, from the outermost item. Includes the current orbit at the end */
const getOrbitPath = (orbit: Orbit): Orbit[] => {
  const parentBody = getParentBody(orbit)
  if (parentBody && !(parentBody.type === 'star')) {
    return [...getOrbitPath(parentBody.orbit), orbit]
  }
  return [orbit]
}

/** Returns the absolute coordinates of an orbital element */
export const getAbsoluteCoords = (orbit: Orbit, t: Date) => {
  const path = getOrbitPath(orbit)
  const coords = path.map((orbit) => getCarthesianCoords(orbit, t))

  return coords.reduce((coord1, coord2) => {
    return { x: coord1.x + coord2.x, y: coord1.y + coord2.y }
  })
}
