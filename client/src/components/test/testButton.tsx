import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { visionAsk } from "../../pixels/remote-engine-pixels";
import { imageGeneration } from "../../pixels/remote-engine-pixels";

import modelsStore from "../../stores/modelsStore";

const TestButton = observer(() => {
  const logData = async () => {
    // await modelsStore.fetchModelStatuses();
    // console.log(toJS(modelsStore.activeModels));
    const response = await imageGeneration(
      "2c51591c-2d5e-4702-9d55-4b96dfb156c8",
      "A dog in a field"
    );
    console.log(response);
  };
  return <button onClick={logData}>Fetch Models</button>;
});

export default TestButton;
