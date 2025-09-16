// src/components/containers/ModelsSidebarStatic.tsx
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Server } from "lucide-react";
import { GrWindows } from "react-icons/gr";
import { RiImageCircleAiFill } from "react-icons/ri";
import { BsSoundwave } from "react-icons/bs";

const ModelsSidebarStatic = observer(() => {
  return (
    <aside
      className="
        hidden md:flex md:flex-col
        w-64 lg:w-72 flex-shrink-0
        h-svh sticky top-0
        border-r bg-sidebar text-sidebar-foreground
        overflow-y-auto
      "
    >
      {/* Header */}
      <div className="p-3 border-b">
        <div className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Server className="size-4" />
          </div>
          <div className="flex min-w-0 flex-col leading-none">
            <span className="font-semibold truncate">Model Demos</span>
            <span className="text-xs text-muted-foreground truncate">
              Dashboard
            </span>
          </div>
        </div>
      </div>

      {/* Groups */}
      <div className="p-2 space-y-4">
        {/* Image-Text-to-Text */}
        <div>
          <div className="h-8 flex items-center px-2 text-xs font-medium text-sidebar-foreground/70">
            Image-Text-to-Text
          </div>
          <ul className="flex w-full min-w-0 flex-col gap-1">
            <li>
              <Link
                to="/"
                className="
                  flex min-w-0 items-center gap-2 rounded-md p-2 text-sm
                  hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
                "
              >
                <GrWindows className="size-4 shrink-0" />
                <span className="truncate">microsoft/Florence-2-large</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Text-to-Speech */}
        <div>
          <div className="h-8 flex items-center px-2 text-xs font-medium text-sidebar-foreground/70">
            Text-to-Speech
          </div>
          <ul className="flex w-full min-w-0 flex-col gap-1">
            <li>
              <Link
                to="/kokoro"
                className="
                  flex min-w-0 items-center gap-2 rounded-md p-2 text-sm
                  hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
                "
              >
                <BsSoundwave className="size-4 shrink-0" />
                <span className="truncate">hexgrad/Kokoro-82M</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Text-to-Image */}
        <div>
          <div className="h-8 flex items-center px-2 text-xs font-medium text-sidebar-foreground/70">
            Text-to-Image
          </div>
          <ul className="flex w-full min-w-0 flex-col gap-1">
            <li>
              <Link
                to="/stable-diffusion"
                className="
                  flex min-w-0 items-center gap-2 rounded-md p-2 text-sm
                  hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
                "
              >
                <RiImageCircleAiFill className="size-4 shrink-0" />
                <span className="truncate">
                  stable-diffusion-v1-5/stable-diffusion-v1-5
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Speech to Text */}
        <div>
          <div className="h-8 flex items-center px-2 text-xs font-medium text-sidebar-foreground/70">
            Speech to Text
          </div>
          <ul className="flex w-full min-w-0 flex-col gap-1">
            <li>
              <Link
                to="/whisper"
                className="
                  flex min-w-0 items-center gap-2 rounded-md p-2 text-sm
                  hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
                "
              >
                <RiImageCircleAiFill className="size-4 shrink-0" />
                <span className="truncate">whisper-large-v3</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Add more groups here if needed */}
      </div>
    </aside>
  );
});

export default ModelsSidebarStatic;
