const Modal = ({ displayModal, onClose }) => {
  let displayMessage = "";
  if (displayModal) {
    if (displayModal.message.includes("password")) {
      displayMessage = "Upisali ste krivu lozinku. Pokušajte ponovo.";
    } else {
      displayMessage =
        "Nepostojeći mail. Provjerite da li unosite ispravan mail i jeste li prethodno kreirali svoj korisnički račun.";
    }
  }
  const modalContent = (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="bg-white p-8 rounded-xl text-center">
        <h2 className="text-xl font-semibold mb-3">
          Došlo je do pogreške... 😔
        </h2>
        <p className="text-gray-500 max-w-lg">{displayMessage}</p>
        <button
          onClick={onClose}
          className="bg-teal-500 text-sm text-white py-3 mt-6 rounded-lg w-1/2 hover:bg-teal-600 hover:font-semibold"
        >
          U redu
        </button>
      </div>
    </div>
  );
  return <>{displayModal ? modalContent : ""}</>;
};

export default Modal;
