import { NextCache } from "./nextCache";

import merge from "lodash/merge";

describe("nextCache", () => {
  it("should return the same object for the same delta", () => {
    interface Info {
      name?: string;
      species?: string;
      meta?: { published?: boolean; approved?: boolean };
    }

    const o1 = { name: "Pizzo", meta: { published: false, approved: false } };
    const o2 = { species: "cat", meta: { approved: true } };
    const o3 = { name: "Andy", species: "human" };

    const nc = new NextCache<Info, Info>(merge);
    const on1 = nc.next(o1, o2);
    const on2 = nc.next(o1, o2);
    const on3 = nc.next(on1, o3);
    const on4 = nc.next(on2, o3);

    expect(on1).toBe(on2);
    expect(on3).toBe(on4);
  });
});
