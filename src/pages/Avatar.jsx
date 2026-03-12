import AvatarButton from "../WebsiteElements/Buttons/AvatarButton";
import ReactImage from "../assets/react.svg"

export default function Avatar() {
  function handleClick() {
    alert("Button clicked!");
  }

  return (
    <div className="container py-5">
      <AvatarButton onClick={handleClick} imageSrc={ReactImage}>
        Kaas 3
      </AvatarButton>
    </div>
  );
}
