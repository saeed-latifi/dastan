import LoadingSpinner from "@components/icons/LoadingSpinner";
import dynamic from "next/dynamic";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
	ssr: false,
	loading: () => <LoadingSpinner />,
});

export default function FormRichText({ value, onChange }: { value: string; onChange: (text: string) => void }) {
	const formats = ["size", "bold", "italic", "list", "bullet", "link", "color", "code", "direction", "align"];

	return (
		<QuillNoSSRWrapper
			value={value}
			className="w-full"
			modules={{ toolbar: [{ size: [] }, { color: [] }, "bold", "italic", "code", { list: "ordered" }, { list: "bullet" }, { direction: "rtl" }] }}
			formats={formats}
			theme="snow"
			onChange={onChange}
		/>
	);
}
