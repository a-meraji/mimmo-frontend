import { PackagesCarousel } from ".";
import { BookOpen } from "lucide-react";

export default function PackageConteiner({title}){
    return(
        <div className="bg-gradient-to-b from-white via-neutral-indigo to-white py-20">
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <BookOpen className="w-8 h-8 text-primary hidden md:block" aria-hidden="true" />
                    <h2 className="text-4xl font-black text-text-charcoal">
                        {title}
                    </h2>
                </div>
                <p className="flex justify-center text-text-gray text-lg px-2">
                <BookOpen className="w-8 h-8 ml-1 text-primary md:hidden" aria-hidden="true" />

                    با بهترین و به‌روزترین متد های آموزشی ، زبان ایتالیایی را بیاموزید
                </p>
            </div>
            <PackagesCarousel />
        </div>
    )
}