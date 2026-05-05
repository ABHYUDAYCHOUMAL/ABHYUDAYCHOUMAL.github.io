import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import About from "./components/About";
import WhatIDo from "./components/WhatIDo";
import Career from "./components/Career";
import Work from "./components/Work";
import Contact from "./components/Contact";
import SocialIcons from "./components/SocialIcons";
import Footer from "./components/Footer";
import CanvasErrorBoundary from "./components/CanvasErrorBoundary";

const TechStack = lazy(() => import("./components/TechStack"));

function App() {
  return (
    <>
      <Navbar />
      <SocialIcons />
      <main>
        <Landing />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <CanvasErrorBoundary>
          <Suspense fallback={null}>
            <TechStack />
          </Suspense>
        </CanvasErrorBoundary>
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
