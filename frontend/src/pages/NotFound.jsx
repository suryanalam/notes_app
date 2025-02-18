import '../assets/styles/notFound.css';
import notFound from '../assets/images/404-cat.png'
import {useNavigate} from 'react-router-dom';

// components
import Header from '../components/Header'

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
    <Header />
    <div className='not-found-container w-100 d-flex flex-column flex-align-center flex-justify-center gap-3'>
       <img src={notFound} alt="404" draggable="false" />
       <h1>Whoops! Page was not found.</h1>
       <button className='btn btn-primary' onClick={()=> navigate('/')}>Go to Homepage</button>
    </div>
    </>
  )
}

export default NotFound