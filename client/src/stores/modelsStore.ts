import { makeAutoObservable, runInAction } from "mobx";
import { getMyRemoteModels } from "../pixels/remote-engine-pixels";

interface ModelStatus {
  id: string;
  name: string;
  state: string;
}

interface RemoteModelStatusesResponse {
  activeModels: ModelStatus[];
  warmingModels: ModelStatus[];
}

export class ModelsStore {
  activeModels: ModelStatus[] = [];
  warmingModels: ModelStatus[] = [];
  selectedModel: ModelStatus = {
    id: "f7dd0ae0-b31c-45d4-906c-044bd217d829",
    name: "florence-2-large",
    state: "active",
  };
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchModelStatuses() {
    this.loading = true;
    const remoteModelStatuses =
      (await getMyRemoteModels()) as RemoteModelStatusesResponse;
    runInAction(() => {
      const activeModelResults = remoteModelStatuses.activeModels;
      const warmingModelResults = remoteModelStatuses.warmingModels;
      this.activeModels = activeModelResults.map((model: ModelStatus) => ({
        id: model.id,
        name: model.name,
        state: model.state,
      }));
      this.warmingModels = warmingModelResults.map((model: ModelStatus) => ({
        id: model.id,
        name: model.name,
        state: model.state,
      }));
      this.loading = false;
    });
  }
}

export const modelsStore = new ModelsStore();
export default modelsStore;
