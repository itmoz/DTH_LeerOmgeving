export default function AvatarButton({
  children,
  imageSrc,
  imageAlt,
  onClick,
}) {
  return (
    <button className="card d-inline-block text-start p-0 m-2 shadow text-center" onClick={onClick}>
      <img
          src={imageSrc}
          className="card-img-top p-2"
          alt={imageAlt || "Avatar catalogue item"}
          style={{
            objectFit: "cover",
            height: "150px",
            width: "100%",
          }} // Adjust dimensions as needed
        />
      <div className="card-text text-body-secondary p-2">
        {children}
      </div>
    </button>
  );
}
