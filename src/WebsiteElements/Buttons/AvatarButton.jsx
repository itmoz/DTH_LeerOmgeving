export default function AvatarButton({
  children,
  imageSrc,
  imageAlt,
  onClick,
  selected,
  locked,
  price,
}) {
  return (
    <button
      className="card d-inline-block text-start p-0 m-2 shadow text-center position-relative"
      onClick={onClick}
      style={{
        borderColor: selected ? "#0d6efd" : "rgba(0, 0, 0, 0.175)",
        transition: "border 0.2s ease",
        overflow: "hidden", // Prevents the overlay from bleeding past the card's rounded corners
      }}
    >
      {/* Locked Overlay */}
      {locked && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)", // Darkens the background
            zIndex: 10, // Ensures the overlay sits above the image and text
          }}
        >
          <i className="bi bi-lock fs-1 mb-1"></i>
          <div className="d-flex align-items-center gap-2 fs-5 fw-bold">
            <i className="bi bi-coin"></i>
            <span>{price}</span>
          </div>
        </div>
      )}

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