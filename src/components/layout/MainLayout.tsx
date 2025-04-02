
import { ReactNode } from "react";
import Navbar from "./Navbar";

interface MainLayoutProps {
  children: ReactNode;
  fullHeight?: boolean;
}

const MainLayout = ({ children, fullHeight = false }: MainLayoutProps) => {
  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${fullHeight ? 'h-screen overflow-hidden' : ''} breathing-bg text-white`}>
      <main className="flex-1 pb-16 md:pb-0 md:pl-16 lg:pl-0 w-full max-w-screen-xl mx-auto">
        {children}
      </main>
      <Navbar />
    </div>
  );
};

export default MainLayout;
