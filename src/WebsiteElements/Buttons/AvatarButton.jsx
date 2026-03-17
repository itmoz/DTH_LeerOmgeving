export default function AvatarButton({
  children,
  imageSrc,
  imageAlt,
  onClick,
  selected,
}) {
  return (
    <button
      className="card d-inline-block text-start p-0 m-2 shadow text-center"
      onClick={onClick}
      style={{
        borderColor: selected ? "#0d6efd" : "rgba(0, 0, 0, 0.175)",
        transition: "border 0.2s ease",
      }}
    >
      <img
        src={imageSrc}
        className="card-img-top p-2"
        alt={imageAlt || "Avatar catalogue item"}
        style={{
          objectFit: "cover",
          height: "150px",
        }}
      />
      <div className="card-text text-body-secondary p-2">{children}</div>
    </button>
  );
}
