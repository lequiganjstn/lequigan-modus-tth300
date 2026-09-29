import Sidebar from "./Sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function PageShell({ children }) {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <div className="shell-toolbar">
          <SidebarTrigger aria-label="Toggle navigation" />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}