import { PackagesCarousel } from ".";

export default function PackageConteiner({title}){
    return(
        <div className="bg-gradient-to-b from-white via-neutral-indigo to-white py-20">
            <h2 className="font-extrabold text-text-charcoal text-3xl text-center mb-10">{title}</h2>
            <PackagesCarousel />
        </div>
    )
}