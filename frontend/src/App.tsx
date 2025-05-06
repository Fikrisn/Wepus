import './App.css'
import Header from './components/header'
import BookTable from './components/bookTable'

function App() {
  return (
    <div className="p-5 h-screen bg-gray-100">
      <Header/>
      <BookTable/>
    </div>
  )
}

export default App