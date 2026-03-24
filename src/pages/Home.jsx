import '../Styling/Home.css'
import Button from '../WebsiteElements/Buttons/Button';
import Sidebar from '../WebsiteElements/Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';


export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>DigiLeer!</h1>
      <p>This is the main page of the application.</p>

      <Button onClick={() => navigate('/login')}>
        Start Learning
      </Button>
    </div>
  );
}
