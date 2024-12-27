import Navbar from './components/navbar.jsx'
import Hero from './components/hero'
import Highlights from './components/Highlights'
import Model from './components/Model'



const App=()=>{

  return (
    <>
      <main className="bg-black">
        <Navbar />
        <Hero />
        <Highlights />
        {/* <Model /> */}
      </main>
    </>
  )
}

export default App
