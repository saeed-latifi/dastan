import LoaderSpinner from "@components/common/loader-spinner";
import dynamic from "next/dynamic";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
	ssr: false,
	loading: () => <LoaderSpinner />,
});

export default function FormRichText({ value, onChange }: { value: string; onChange: (text: string) => void }) {
	const formats = ["size", "bold", "italic", "list", "bullet", "link", "color", "code", "direction", "align"];

	return (
		<QuillNoSSRWrapper
			value={value}
			className="w-full"
			modules={{
				toolbar: [
					{ size: [] },
					{ color: [] },
					"bold",
					"italic",
					"code",
					{ list: "ordered" },
					{ list: "bullet" },
					{ direction: "rtl" },
				],
			}}
			formats={formats}
			theme="snow"
			onChange={(content) => {
				onChange(content);
			}}
		/>
	);
}
