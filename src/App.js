import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import EditPhoto from './routes/EditPhoto.jsx';
import Home from './routes/Home.jsx';
import Photos from './routes/Photos.jsx';
import AddPhoto from './routes/AddPhoto.jsx';
import NotFound from './routes/NotFound.jsx';

const App = () => {
  return (
    <>
      <div className='all-navbar'>
        <img className='logo' src='img/logo-photo.png' alt='logo'/>
        <div className='navbar'>
            <Link to='/'>Home</Link>
            <Link to='/photos'>My Photos</Link>
            <Link to='/add'>Add Photo</Link>
        </div>
    </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photos">
          <Route index element={<Photos />} />
          <Route path=":id" element={<EditPhoto />} />
        </Route>
        <Route path="/add" element={<AddPhoto />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
