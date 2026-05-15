export default function PurchaseModal({ isOpen, item, onConfirm, onCancel }) {
  if (!isOpen || !item) return null; // Added a safety check for 'item' just in case

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          
          <div className="modal-header">
            <h5 className="modal-title">Confirm Purchase</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body text-center py-4">
            <div className="text-center">
              <img src={item.img} className="w-50" alt={item.name} />
            </div>
            <p className="fs-5 my-3">
              Are you sure you want to unlock <strong>{item.name}</strong>?
            </p>

            <div className="d-flex justify-content-center flex-column align-items-center gap-2 mt-4">
              <button
                type="button"
                className="btn btn-primary btn-lg d-flex justify-content-center align-items-center gap-2 px-4 fw-bold"
                onClick={onConfirm}
              >
                <i className="dth-coin"></i>
                <span>{item.price}</span>
              </button>
              
              <button
                type="button"
                className="btn btn-secondary btn-lg px-4"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}