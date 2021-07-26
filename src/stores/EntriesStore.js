// Absolute Imports
import { makeObservable, observable, action, runInAction } from "mobx";
import axios from "axios";

// Configuration
import appconfig from "../config/production";

// Utils
import Network from "../utils/Network";

export default class EntriesStore {

  constructor() {
    this.init();
    makeObservable(this, {
      entryData: observable,
      yamGiveawayData: observable,
      getYamGiveawayData: action,
      importData: action,
      init: action,
    });
  }
  
  init() {
    this.entryData = null;
    this.yamGiveawayData = null;
    this.giveawayTitle = "giveaway";
  }

  importData() {

  }

  async getYamGiveawayData() {
    const { data } = await axios.get(appconfig.yammieAPI);
    Network.netLog("GET", data);
    if (!data.success) return;
    runInAction(() => {
      this.yamGiveawayData = data.data;
    });
  }
}