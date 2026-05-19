import Button from '../WebsiteElements/Buttons/Button';
import Sidebar from '../WebsiteElements/Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { triggerAchievement } from '../utils/achievementSystem';



export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>DigiLeer!</h1>
      <p>This is the main page of the application.</p>

      <Button variant='primary' onClick={() => navigate('/LearningDashboard')}> 
        Start Learning
      </Button>

      <Button variant='warning' onClick={() => triggerAchievement('lesson_completed', { lessonId: 2 })}>
        Trigger Lessong Complete
      </Button>
    </div>
  );
}
