
import { ReactNode } from "react";
import Navbar from "./Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0 md:pl-16 lg:pl-0">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
