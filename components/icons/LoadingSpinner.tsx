// import Lottie from "react-lottie";
// import * as loading from "@assets/animations/bevy.json";

// const defaultOptions = {
// 	loop: true,
// 	autoplay: true,
// 	animationData: loading,
// 	// rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
// };
export default function LoadingSpinner({ height = "2rem", width = "2rem" }: { height?: string; width?: string }) {
	// return <Lottie options={defaultOptions} width={width} height={height} />;
	return (
		<svg viewBox="0 0 270.93332 270.93332" version="1.1" id="svg48263" xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
			<defs id="defs48260">
				<linearGradient id="linearGradient45253-7">
					<stop style={{ stopColor: "#b2002f", stopOpacity: 1 }} offset="0" id="stop45249-6" />
					<stop style={{ stopColor: "#ffea00", stopOpacity: 1 }} offset="1" id="stop45251-6" />
				</linearGradient>
				<radialGradient
					xlinkHref="#linearGradient45253-7"
					id="radialGradient2390"
					gradientUnits="userSpaceOnUse"
					gradientTransform="matrix(-2.8874713,2.3630391,-1.707737,-2.1212635,1026.2487,-286.24533)"
					cx="226.06186"
					cy="93.111053"
					fx="226.06186"
					fy="93.111053"
					r="67.733414"
				/>
			</defs>
			<g id="g2386" style={{ display: "inline" }}>
				<path
					id="path2380"
					style={{
						display: "inline",
						fill: "url(#radialGradient2390)",
						fillOpacity: 1,
						stroke: "#86e600",
						strokeWidth: 2,
						strokeLinecap: "butt",
						strokeLinejoin: "miter",
						strokeMiterlimit: 4,
						strokeDasharray: "none",
						strokeOpacity: 0.3,
					}}
					d="m 198.78226,16.404167 c 1.83562,24.680563 -12.21538,25.243438 -9.75258,52.070325 -2.60432,0.68581 -5.07368,1.54126 -7.42974,2.53761 -26.32634,-6.23336 -48.29344,-6.75633 -74.8136,-0.49319 -22.19546,5.24179 -44.82239,19.66118 -77.527589,18.77392 26.455544,26.502008 77.517369,39.387248 109.018929,32.886788 -8.59294,17.41843 -16.50452,35.25684 -28.26444,47.50229 L 3.175,254.52916 l 51.66872,-7.64457 69.14896,-66.3906 c 22.2259,-0.33008 41.5651,-4.78883 57.77578,-12.30187 7.377,-3.03696 14.19062,-6.78181 20.32735,-11.17253 -3.56091,28.57973 28.66148,50.85029 65.66252,65.90647 -19.33946,-30.14611 5.8551,-84.57395 -30.81864,-121.84198 4.43996,-21.013048 2.17258,-40.353758 -2.20196,-50.834546 -6.48248,-15.531423 -14.96184,-20.675312 -25.66582,-21.219971 z"
				/>
			</g>
		</svg>
	);
}
