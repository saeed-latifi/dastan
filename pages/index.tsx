import DarkSection from "@components/sections/dark-section";
import GallerySection from "@components/sections/gallery";
import HeroSection from "@components/sections/hero"
import LightSection from "@components/sections/light-section";
import MasonSection from "@components/sections/mason";

export default function Home() {
	return (
		<div>
			<HeroSection></HeroSection>
			<MasonSection></MasonSection>
			<GallerySection></GallerySection>
			<DarkSection></DarkSection>
			<LightSection></LightSection>
		</div>
	);
}
