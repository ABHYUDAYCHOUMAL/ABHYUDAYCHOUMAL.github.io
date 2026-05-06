import { lazy, Suspense, useEffect } from "react";
import "./lib/gsap"; // ensure GSAP plugins register before any consumer
import { initMagnetic } from "./lib/magnetic";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import About from "./components/About";
import WhatIDo from "./components/WhatIDo";
import Career from "./components/Career";
import Work from "./components/Work";
import Contact from "./components/Contact";
import SocialIcons from "./components/SocialIcons";
import Footer from "./components/Footer";
import Cursor from "./components/Cursor";
import AmbientGlow from "./components/AmbientGlow";
import SmoothScroll from "./components/SmoothScroll";
import LoadingScreen from "./components/LoadingScreen";
import MarqueeStrip from "./components/MarqueeStrip";
import CanvasErrorBoundary from "./components/CanvasErrorBoundary";

const TechStack = lazy(() => import("./components/TechStack"));

const MARQUEE_ITEMS = [
  "Backend",
  "Architecture",
  "FastAPI",
  "Distributed systems",
  "Open to work",
  "RAG / LLM",
  "iOS",
  "Integrations",
];

function App() {
  useEffect(() => {
    // Activate magnetic-pull effect on `.magnetic` buttons after first
    // paint. Delay one frame so React has finished mounting refs.
    const id = requestAnimationFrame(initMagnetic);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <LoadingScreen />

      {/* Fixed-position elements live OUTSIDE SmoothScroll so they
          aren't re-anchored to the smoother's transformed parent. */}
      <Navbar />
      <SocialIcons />
      <Cursor />
      <AmbientGlow />

      <SmoothScroll>
        <main>
          <Landing />
          <About />
          <MarqueeStrip items={MARQUEE_ITEMS} />
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
      </SmoothScroll>
    </>
  );
}

export default App;
