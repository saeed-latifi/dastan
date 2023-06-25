export default function onFocus({ focusId }: { focusId: string }) {
	const element = document.getElementById(focusId);
	element?.focus();
	element?.scrollIntoView({ behavior: "smooth" });
}
