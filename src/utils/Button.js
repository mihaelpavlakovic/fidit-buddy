import React from "react";

const Button = props => {
	let classItems = "";
	if (props.btnType === "primary") {
		classItems =
			"text-sm text-white hover:font-semibold bg-teal-500 hover:bg-teal-400 rounded-md";
	} else if (props.btnType === "secondary") {
		classItems =
			"text-sm text-teal-500 bg-white rounded-md border-2 border-teal-500 border-solid hover:font-semibold";
	} else if (props.btnType === "icon") {
		classItems = "text-gray-500 hover:text-gray-700";
	} else if (props.btnType === "danger") {
		classItems =
			"text-sm bg-red-500 hover:bg-red-600 text-white rounded-md disabled:bg-red-300 disabled:cursor-not-allowed";
	}

	return (
		<button
			className={`${classItems} ${props.addClasses}`}
			type={props.btnAction}
			onClick={props.onClick}
			disabled={props.isDisabled}
		>
			{props.children}
			{props.text}
		</button>
	);
};

export default Button;
