import "../../index.css";
import { useInsight } from "@semoss/sdk-react";
import {
  SidebarProvider,
  SidebarInset,
} from "../../@providers/components/ui/sidebar";
import ModelsSidebar from "../../components/containers/sidebar";
import useFetchUserData from "../../hooks/useFetchUserData";
import KokoroContainer from "../../components/models/kokoro/kokoroContainer";

function Kokoro() {
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
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <ModelsSidebar />
        <SidebarInset className="flex-1 p-4 w-full">
          <KokoroContainer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default Kokoro;
