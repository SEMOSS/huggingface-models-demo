import { useState, useLayoutEffect } from "react";
import {
  Router as ReactRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { createHashHistory } from "history";
import { useInsight } from "@semoss/sdk/react";
import App from "./app/App";
import StableDiffusion from "./stable-diffusion/stable-diffusion";
import Kokoro from "./kokoro/kokoro";
import Whisper from "./whisper/whisper";

export const history = createHashHistory();

export const Router = () => {
  const { isInitialized, error } = useInsight();

  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  if (!isInitialized) {
    return <>LOADING</>;
  }

  if (error) {
    return <>Error</>;
  }

  return (
    <ReactRouter
      location={state.location}
      navigationType={state.action}
      navigator={history}
    >
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/stable-diffusion" element={<StableDiffusion />} />
        <Route path="/kokoro" element={<Kokoro />} />
        <Route path="/whisper" element={<Whisper />} />
      </Routes>
    </ReactRouter>
  );
};
