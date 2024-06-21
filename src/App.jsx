import './App.css'
import Navbar from './components/Navbar'
import Manager from './components/Manager'
import Footer from './components/Footer'

function App() {
  return (
    <>
    <div className=''>
    <div className="absolute inset-0 -z-10  [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
      <Navbar />
      <div className='min-h-[86vh]'>
      <Manager />
      </div>
      <Footer />
      </div>
    </>
  )
}

export default App
