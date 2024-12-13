import '../assets/styles/notFound.css';
import Header from '../components/Header'

const NotFound = () => {
  return (
    <>
    <Header />
    <div className='not-found-container w-100 d-flex flex-align-center flex-justify-center'>
        <h1>Oops!! Page Not Found</h1>
    </div>
    </>
  )
}

export default NotFound