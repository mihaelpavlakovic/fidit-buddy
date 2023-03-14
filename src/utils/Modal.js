// component imports
import Button from "./Button";

const Modal = ({ displayModal, onClose }) => {
	let displayMessage = "";
	if (displayModal) {
		if (displayModal.message.includes("password")) {
			displayMessage = "Upisali ste krivu lozinku. Pokušajte ponovo.";
		} else if (displayModal.message === "not-verified") {
			displayMessage =
				"Račun nije verificiran. Provjerite svoju dolaznu poštu (ili spam) kako bi ste verificirali svoj račun.";
		} else if (displayModal.message === "verification-required") {
			displayMessage =
				"Na Vašu email adresu poslali smo poveznicu za verifikaciju kreiranog računa. Potrebno je verificirati račun kako bi ste se mogli prijaviti!";
		} else {
			displayMessage =
				"Nepostojeći mail. Provjerite da li unosite ispravan mail i jeste li prethodno kreirali svoj korisnički račun.";
		}
	}
	const modalContent = (
		<div
			onClick={onClose}
			className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
		>
			<div className="bg-white p-8 rounded-xl text-center">
				<h2 className="text-xl font-semibold mb-3">
					{displayModal.message === "verification-required"
						? "Verifikacija računa"
						: "Došlo je do pogreške... 😔"}
				</h2>
				<p className="text-gray-500 max-w-lg">{displayMessage}</p>
				<Button
					text="U redu"
					btnAction="button"
					btnType="primary"
					addClasses="py-3 mt-6 w-1/2"
					onClick={onClose}
				/>
			</div>
		</div>
	);
	return <>{displayModal ? modalContent : ""}</>;
};

export default Modal;
