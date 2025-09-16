import "../../index.css";
import { useInsight } from "@semoss/sdk/react";
import {
  SidebarProvider,
  SidebarInset,
} from "../../@providers/components/ui/sidebar";
import ModelsSidebar from "../../components/containers/sidebar";
import useFetchUserData from "../../hooks/useFetchUserData";
import StableDiffusionContainer from "../../components/models/stable-diffusion/stableDiffusionContainer";
import ModelsSidebarStatic from "../../components/containers/sidebar2";
import MobileSidebar from "../../components/containers/mobile-sidebar";

function StableDiffusion() {
  const { isAuthorized } = useInsight();
  const userStore = useFetchUserData();

  const authMessage = isAuthorized
    ? "User is authorized!"
    : "User is not authorized!";

  const noAuthJsx = (
    <div className="text-red-500">
      <p>{authMessage}</p>
      <p>Please log in to continue.</p>
    </div>
  );

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <header className="text-center">{noAuthJsx}</header>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-svh
        grid
        grid-cols-1 md:grid-cols-[16rem_1fr] lg:grid-cols-[18rem_1fr]
      "
    >
      <ModelsSidebarStatic />
      <main className="flex min-w-0 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
          <MobileSidebar />
          <h1 className="font-semibold">Model Demos</h1>
        </header>
        <div className="flex-1 min-w-0 p-4">
          <StableDiffusionContainer />
        </div>
      </main>
    </div>
  );
}

export default StableDiffusion;
