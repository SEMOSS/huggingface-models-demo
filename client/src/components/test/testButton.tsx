import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { visionAsk } from "../../pixels/remote-engine-pixels";

import modelsStore from "../../stores/modelsStore";

const TestButton = observer(() => {
  const logData = async () => {
    // await modelsStore.fetchModelStatuses();
    // console.log(toJS(modelsStore.activeModels));
    const response = await visionAsk(
      "f7dd0ae0-b31c-45d4-906c-044bd217d829",
      "<CAPTION>",
      "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/transformers/tasks/car.jpg?download=true"
    );
    console.log(response);
  };
  return <button onClick={logData}>Fetch Models</button>;
});

export default TestButton;
