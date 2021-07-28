// Absolute Imports
import { makeObservable, observable, action, runInAction } from "mobx";
import axios from "axios";
import csv2json from "csvtojson";
import { v4 as uuidv4 } from "uuid";

// Configuration
import appconfig from "../config/production";

// Utils
import Network from "../utils/Network";

const colNames = ["ENTRIES", "NAME", "STATE", "WIN ZONE"];
const { ipcRenderer } = window;

const convertToJSON = async (csv) => {
  return new Promise((resolve, reject) => {
    csv2json()
      .fromString(csv)
      .then(jsonObj => {
        resolve(jsonObj);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export default class EntriesStore {

  constructor() {
    this.init();
    makeObservable(this, {
      entryData: observable,
      spreadArray: observable,
      yamGiveawayData: observable,
      error: observable,
      loadingMessage: observable,
      loadingEntryData: observable,
      entryDataPath: observable,
      rawData: observable,
      showGiveaway: observable,
      successfulData: observable,
      showSummary: observable,
      totalStates: observable,
      winningEntrant: observable,
      showWinner: observable,
      dataRowOffset: observable,
      dataHeaderOffset: observable,
      displayGiveaway: action,
      getYamGiveawayData: action,
      importData: action,
      readData: action,
      validateRawData: action,
      init: action,
      displaySummary: action,
      setWinningEntrant: action,
    });
  }
  
  init() {
    this.totalStates = 0;
    this.showWinner = false;
    this.winningEntrant = null;
    this.dataRowOffset = 0;
    this.dataHeaderOffset = 1;
    this.showGiveaway = false;
    this.showSummary = false;
    this.entryData = null;
    this.loadingMessage = "";
    this.successfulData = false;
    this.spreadArray = [];
    this.rawData = null;
    this.entryDataPath = null;
    this.error = null;
    this.loadingEntryData = false;
    this.yamGiveawayData = null;
    this.giveawayTitle = "giveaway";
  }

  generateRandomInt(min, max) {
    return new Promise((resolve, reject) => {
      ipcRenderer.once('random-int', (event, n) => {
        resolve(n);
      })
      ipcRenderer.send('random-int', { min, max });
    });
  }

  setShowWinner(val) {
    this.showWinner = val;
  }

  setWinningEntrant(we) {
    this.winningEntrant = we;
  }

  displaySummary() {
    this.showSummary = true;
    setTimeout(() => {
      runInAction(() => {
        this.showSummary = false;
      });
    }, 4000);
  }

  displayGiveaway() {
    this.showGiveaway = true;
  }

  importData() {
    this.init();
    console.log(this);
    ipcRenderer.once('import-data', (event, { err, data }) => {
      if (err) {
        runInAction(() => { this.error = err.message });
        return;
      }

      if (data.canceled || !data?.filePaths?.length) {
        return;
      }

      runInAction(() => {
        this.entryDataPath = data.filePaths[0];
        this.loadingMessage = "LOADING ENTRANT DATA";
        this.loadingEntryData = true;
        this.error = null;
      });

      setTimeout(() => {
        this.readData();
      }, 1000);
    });

    ipcRenderer.send('import-data');
  }

  readData() {
    if (!this.entryDataPath) return;

    ipcRenderer.once('read-data', (event, { err, data }) => {
      if (err) {
        runInAction(() => {
          this.error = err.message;
          this.loadingEntryData = false;
          this.entryDataPath = null;
        });
        return;
      }


      runInAction(() => {
        this.error = null;
        this.loadingEntryData = true;
        this.loadingMessage = "PARSING ENTRY DATA";
        this.entryDataPath = null;
        this.rawData = data;
      });

      setTimeout(() => {
        this.validateRawData();
      }, 1000);
    });

    ipcRenderer.send('read-data', this.entryDataPath);
  }

  async validateRawData() {
    if (!this.rawData) {
      runInAction(() => {
        this.loadingEntryData = false;
        this.error = "Couldn't find data to validate";
      });
      return;
    }

    // Attempt to convert the CSV into JSON
    let parsedData;
    try {
      parsedData = await convertToJSON(this.rawData);
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.loadingEntryData = false;
        this.error = "Failed to parse data";
      });
      return;
    }

    // Validate there is some data in the JSON
    if (!parsedData || !parsedData.length) {
      runInAction(() => {
        this.loadingEntryData = false;
        this.error = "No Data Found In File";
      });
    }

    // Ensure all required column names are present
    const foundColNames = Object.keys(parsedData[0]).map(c => c.toUpperCase());
    for (let i = 0; i < colNames.length; i++) {
      if (!foundColNames.includes(colNames[i])) {
        runInAction(() => {
          this.loadingEntryData = false;
          this.error = `Could not find column ${colNames[i]}`;
        });
        return;
      }
    }

    // Format data so it is easier to work with
    let formattedData;
    let states = new Set();
    try {
      formattedData = parsedData.map((entrant) => {
        const formattedEntrant = {};
        foundColNames.forEach((c) => {
          if (!colNames.includes(c.toUpperCase())) return;
          formattedEntrant[c.toUpperCase()] = entrant[c];
        });

        formattedEntrant.ID = uuidv4();
        formattedEntrant["ENTRIES"] = parseInt(formattedEntrant["ENTRIES"].replace(/,/g, ''));
        formattedEntrant["WIN ZONE"] = parseInt(formattedEntrant["WIN ZONE"].replace(/,/g, ''));
        formattedEntrant["STATE"] = formattedEntrant["STATE"]?.toUpperCase ? formattedEntrant["STATE"].toUpperCase() : formattedEntrant["STATE"];
        if (!states.has(formattedEntrant["STATE"])) states.add(formattedEntrant["STATE"]);
        return formattedEntrant;
      });
    } catch (err) {
      runInAction(() => {
        this.loadingEntryData = false;
        this.error = "Some of the data is malformed";
      });
      return;
    }

    if (formattedData[0].NAME === "PLACE HOLDER") {
      runInAction(() => {
        this.dataRowOffset = this.dataRowOffset + 1;
      });
      formattedData = formattedData.slice(1, formattedData.length);
    }

    const spreaded = [];
    formattedData.forEach(entrant => {
      const nEntries = entrant.ENTRIES;
      for (let i = 0; i < nEntries; i++) spreaded.push(entrant.ID);
    });

    runInAction(() => {
      this.loadingMessage = "SUCCESSFULLY LOADED";
      this.successfulData = true;
    });

    setTimeout(() => {
      runInAction(() => {
        this.totalStates = states.size;
        this.spreadArray = spreaded;
        this.entryData = formattedData;
        console.log(formattedData);
      });
    }, 1000);

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