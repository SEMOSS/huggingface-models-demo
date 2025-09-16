// src/components/containers/MobileSidebar.tsx
import { useState } from "react";
import { Menu } from "lucide-react";
import ModelsSidebarStatic from "./sidebar2";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="size-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-svh w-72 bg-sidebar text-sidebar-foreground border-r shadow-xl">
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="p-2 border-b">
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm underline"
                >
                  Close
                </button>
              </div>
              <div className="[&>aside]:block">
                <ModelsSidebarStatic />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
