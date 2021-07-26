import { createContext } from "react";
import EntriesStore from "./EntriesStore";

export default class RootStore {
  constructor() {
    this.entriesStore = new EntriesStore();
  }

  // This completely wipes the central store
  reset() {
    const stores = Object.keys(this);
    for (const store of stores) {
      this[store].init();
    }
  }
}

export const rootStore = new RootStore();
export const RootContext = createContext(rootStore);