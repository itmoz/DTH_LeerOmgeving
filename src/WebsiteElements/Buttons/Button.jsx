import "./Button.css";

export default function Button({ children, onClick, variant = "primary" }) {
  return (
    <button 
      className={`btn btn-${variant}`} 
      onClick={onClick} // function to handle click events. What it does is determined inside the class it is used in.
    >
      {children}
    </button>
  );
}
