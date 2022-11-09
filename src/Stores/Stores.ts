import { makeObservable } from "mobx";
import AppStore from "./AppStore";
import MapStore from "../Map/MapStore";
import StatusStore from "../Status/StatusStore";

export interface IStores {
  appStore: AppStore;
  mapStore: MapStore;
  statusStore: StatusStore;
}

export class Stores implements IStores {
  appStore: AppStore;
  mapStore: MapStore;
  statusStore: StatusStore;

  static instance: IStores;

  // Singleton pattern: getInstance and private constructor
  static getInstance(): IStores {
    if (Stores.instance === undefined) {
      Stores.instance = new Stores();
    }
    return Stores.instance;
  }

  private constructor() {
    makeObservable(this, {});

    // initialize all stores in correct order
    this.appStore = new AppStore();
    this.mapStore = new MapStore(this.appStore);
    this.statusStore = new StatusStore(this.appStore);
  }
}
