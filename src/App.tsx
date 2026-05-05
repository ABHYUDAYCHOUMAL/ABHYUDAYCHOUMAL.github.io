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

const TechStack = lazy(() => import("./components/TechStack"));
const Avatar = lazy(() => import("./components/Avatar"));

function App() {
  return (
    <>
      <Navbar />
      <SocialIcons />
      <main>
        <Landing />
        <About />
        <Suspense fallback={null}>
          <Avatar />
        </Suspense>
        <WhatIDo />
        <Career />
        <Work />
        <Suspense fallback={null}>
          <TechStack />
        </Suspense>
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
