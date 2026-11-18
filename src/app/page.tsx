import Engine from "@/components/surface/Engine";
import TitleBar from "@/components/surface/TitleBar";
import Sidebar from "@/components/surface/Sidebar";
import StatusBar from "@/components/surface/StatusBar";
import CommitGraph from "@/components/surface/CommitGraph";
import Toaster from "@/components/surface/Toaster";
import Overlays from "@/components/surface/Overlays";
import Hotkeys from "@/components/surface/Hotkeys";
import Palette from "@/components/surface/Palette";
import AboutAct from "@/components/acts/AboutAct";
import WorkAct from "@/components/acts/WorkAct";
import QuietAct from "@/components/acts/QuietAct";
import ArchitectureAct from "@/components/acts/ArchitectureAct";
import CareerAct from "@/components/acts/CareerAct";
import StackAct from "@/components/acts/StackAct";
import ContactAct from "@/components/acts/ContactAct";

export default function Home() {
  return (
    <>
      <TitleBar />
      <Sidebar />
      <main className="surface-main">
        <AboutAct />
        <WorkAct />
        <QuietAct />
        <ArchitectureAct />
        <CareerAct />
        <StackAct />
        <ContactAct />
      </main>
      <CommitGraph />
      <StatusBar />
      <Toaster />
      <Overlays />
      <Palette />
      <Hotkeys />
      <Engine />
    </>
  );
}
