import '../Styling/Home.css'
import Button from '../WebsiteElements/Buttons/Button';

export default function Home() {

  function handleClick() {
    alert("Button clicked!");
  }

  return (
    <div className="home-container">
      <h1>DigiLeer!</h1>
      <p>This is the main page of the application.</p>

      <Button onClick={handleClick}>
        Start Learning
      </Button>
    </div>
  )
}
