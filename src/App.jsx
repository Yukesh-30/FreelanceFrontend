import Ancient404 from './ui/ancient404'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
function App() {


  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Ancient404 />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
