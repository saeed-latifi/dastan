export default function GallerySection() {
    return (
        <div className="pb-10 px-32">
            <p className="text-2xl">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.</p>
            <br />
            <div className="grid gird-cols-4 grid-rows-1 grid-flow-col gap-6 text-center">
                <div className="bg-theme-light-gray h-64"></div>
                <div className="bg-theme-light-gray"></div>
                <div className="bg-theme-light-gray"></div>
                <div className="bg-theme-light-gray"></div>
            </div>
        </div>
    )
}