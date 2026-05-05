import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import About from "./components/About";
import WhatIDo from "./components/WhatIDo";
import Career from "./components/Career";
import Work from "./components/Work";
import Contact from "./components/Contact";
import SocialIcons from "./components/SocialIcons";
import Footer from "./components/Footer";

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
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
