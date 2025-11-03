import { Hero, Stats, MediaPartners, PackageConteiner, Roadmap, DrivingLicenseHome, Testimonials, DownloadLinks, SocialLinks, FAQ } from "@/components/home";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Stats />
      <PackageConteiner title={"دوره های آموزشی زبان ایتالیای"} />
      <Roadmap />
      <DrivingLicenseHome />
      <Testimonials />
      <DownloadLinks />
      <MediaPartners />
      <SocialLinks />
      <FAQ />
    </div>
  );
}
