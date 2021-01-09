import create from 'zustand'
import { Body, OrbitalElement, Spacecraft, System } from '@othrworld/core'
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

const getParent = (orbElt: OrbitalElement): Body | undefined =>
  useSystemStore
    .getState()
    .system.bodies.find(({ id }) => id === orbElt.parentId)

/** Returns an array of parents, from the outermost item */
const getParentPath = (orbElt: OrbitalElement): OrbitalElement[] => {
  const parent = getParent(orbElt)
  if (parent && !(parent.type === 'star')) {
    return [...getParentPath(parent), orbElt]
  }
  return [orbElt]
}

/** Returns the absolute coordinates of an orbital element */
export const getAbsoluteCoords = (orbElt: OrbitalElement, t: Date) => {
  const path = getParentPath(orbElt)
  const coords = path.map((body) => getCarthesianCoords(body.orbit, t))
  console.log(path, coords)

  return coords.reduce((coord1, coord2) => {
    return { x: coord1.x + coord2.x, y: coord1.y + coord2.y }
  })
}
