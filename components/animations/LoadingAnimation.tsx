import Lottie from "react-lottie";
import * as loading from "@assets/animations/bevy.json";

const defaultOptions = {
	loop: true,
	autoplay: true,
	animationData: loading,
	// rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
};
export default function LoadingSpinner({ height = "2rem", width = "2rem" }: { height?: string; width?: string }) {
	return <Lottie options={defaultOptions} width={width} height={height} />;
}
