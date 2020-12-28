import { createStyled } from '@stitches/react'

export const space = {
  $0: '0rem',
  $1: '0.25rem',
  $2: '0.5rem',
  $3: '0.75rem',
  $4: '1rem',
} as const
type SpaceKey = keyof typeof space
type Space = SpaceKey | (string & {}) | (number & {})

// @ts-expect-error Object.keys
export const spaceKeys: Array<SpaceKey> = Object.keys(space)

/** Helper to create variants */
export const mapSpace = <T>(iter: (s: SpaceKey) => T): Record<SpaceKey, T> => {
  return spaceKeys.reduce<Record<SpaceKey, T>>(
    (acc, spaceKey) => ({
      ...acc,
      [spaceKey]: iter(spaceKey),
    }),
    {} as Record<SpaceKey, T>
  )
}

export const { styled, css } = createStyled({
  prefix: '',
  showFriendlyClassnames: false,
  tokens: {
    space,
    colors: {
      $sol: '#fcef99',
      $planet: '#c1beae',
      $planetorbit: '#c1beae',

      $grey10: 'hsl(10, 12%, 12%)',
      $grey20: 'hsl(10, 12%, 23%)',
      $grey30: 'hsl(10, 12%, 33%)',
      $grey50: 'hsl(10, 5%, 55%)',
      $grey95: 'hsl(2, 10%, 95%)',

      $pauseBanner: '#934b29',
    },
    sizes: {
      $ticketWidth: '17rem',
      $ticketMinHeight: '7rem',
    },
    fonts: {
      $sansSerif: `-apple-system, BlinkMacSystemFont,
        "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
        "Fira Sans", "Droid Sans", "Helvetica Neue",
        sans-serif
      `,
    },
    fontWeights: {
      $thin: '300',
      $normal: '400',
      $bold: '500',
    },
    radii: {
      $1: '0.25rem',
    },
  },

  breakpoints: {},

  utils: {
    // --- PADDING ---
    p: () => (value: Space) => ({
      paddingTop: value,
      paddingBottom: value,
      paddingLeft: value,
      paddingRight: value,
    }),
    pt: () => (v: Space) => ({ paddingTop: v }),
    pr: () => (v: Space) => ({ paddingRight: v }),
    pb: () => (v: Space) => ({ paddingBottom: v }),
    pl: () => (v: Space) => ({ paddingLeft: v }),
    px: () => (v: Space) => ({ paddingLeft: v, paddingRight: v }),
    py: () => (v: Space) => ({ paddingTop: v, paddingBottom: v }),

    // --- MARGIN ---
    m: () => (v: Space) => ({
      marginTop: v,
      marginBottom: v,
      marginLeft: v,
      marginRight: v,
    }),
    mt: () => (v: Space) => ({ marginTop: v }),
    mr: () => (v: Space) => ({ marginRight: v }),
    mb: () => (v: Space) => ({ marginBottom: v }),
    ml: () => (v: Space) => ({ marginLeft: v }),
    mx: () => (v: Space) => ({ marginLeft: v, marginRight: v }),
    my: () => (v: Space) => ({ marginTop: v, marginBottom: v }),
  },
})
