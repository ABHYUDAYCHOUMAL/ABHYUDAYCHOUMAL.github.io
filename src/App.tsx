import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import About from "./components/About";
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
      </main>
      <Footer />
    </>
  );
}

export default App;
