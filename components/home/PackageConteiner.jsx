import { PackagesCarousel } from ".";
import { BookOpen } from "lucide-react";

export default function PackageConteiner({title}){
    return(
        <div className="bg-gradient-to-b from-white via-neutral-indigo to-white py-20">
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <BookOpen className="w-8 h-8 text-primary" aria-hidden="true" />
                    <h2 className="text-4xl font-black text-text-charcoal">
                        {title}
                    </h2>
                </div>
                <p className="text-text-gray text-lg">
                    با بهترین و به‌روزترین متد های آموزشی ، زبان ایتالیایی را بیاموزید
                </p>
            </div>
            <PackagesCarousel />
        </div>
    )
}