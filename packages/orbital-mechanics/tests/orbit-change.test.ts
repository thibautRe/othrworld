import { createFixedID } from "@othrworld/core";
import { unit } from "@othrworld/units";
import { recalculateOrbitForPosAndSpeed } from "../";
import { orbitEllipse1 } from "./fixtures";

test("Orbit Change: recalculateOrbitForPosAndSpeed", () => {
  expect(
    recalculateOrbitForPosAndSpeed(
      orbitEllipse1,
      { x: unit(50), y: unit(50) },
      { x: unit(-0.0000001), y: unit(0.0000001) },
      new Date("2020-04-04")
    )
  ).toMatchInlineSnapshot(`
    Object {
      "a": 35.35908516736843,
      "e": 0.999788110579031,
      "parentId": "ellipse1",
      "parentMass": 100,
      "phi": 3.9269908169872414,
      "t0": 2020-01-01T10:04:15.275Z,
    }
  `);

  expect(
    recalculateOrbitForPosAndSpeed(
      {
        a: unit(26701796.135601416),
        e: 0.865097802881665,
        parentId: createFixedID("ID"),
        parentMass: unit(1.5053255358940854e24),
        phi: 0.3311171591510967,
        t0: new Date(1611602521370),
      },
      { x: unit(-47096233.269638695), y: unit(-16190440.38855717) },
      { x: unit(173.1969741840608), y: unit(-503.8112006911377) },
      new Date(1611645767028)
    )
  ).toMatchInlineSnapshot(`
    Object {
      "a": 26784869.636649903,
      "e": 0.8593131861788373,
      "parentId": "ID",
      "parentMass": 1.5053255358940854e+24,
      "phi": 0.3311171591845633,
      "t0": 2021-01-25T19:18:39.396Z,
    }
  `);
});
