import { configure } from "mobx";

export function initializeMobX() {
  configure({
    computedRequiresReaction: true,
    reactionRequiresObservable: true,
    observableRequiresReaction: true,
  });
}
