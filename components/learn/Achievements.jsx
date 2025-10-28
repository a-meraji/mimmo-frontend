"use client";

import { useState, useMemo } from "react";
import BadgeCard from "./BadgeCard";

export default function Achievements({ badges = [] }) {
  // State to track current badge in ranked groups
  const [rankedBadgeIndex, setRankedBadgeIndex] = useState({});

  // Default badges data matching the image order
  const defaultBadges = useMemo(() => [
    {
      id: "badge1",
      image: "/badge2.png",
      title: "قهرمان ماراتن",
      description: "اتمام دوره",
      achieved: true,
      ranked: false,
    },
    {
      id: "badge2",
      image: "/badge1.png",
      title: "پروفسور",
      description: "میانگین بالای ۸۰ درصد در آزمون ها",
      achieved: false,
      ranked: false,
    },
    {
      id: "badge3",
      image: "/badge0.png",
      title: "سریع و خشن",
      description: "اتمام دوره در بازه زمانی ۳۰ روزه",
      achieved: true,
      ranked: false,
    },
    {
      id: "badge4",
      image: "/badge6.png",
      title: "معرفی به دوستان",
      description: "کد معرفی را با دوستانت به اشتراک بگذار!",
      achieved: false,
      ranked: false,
    },
    {
      id: "badge5",
      image: "/badge5.png",
      title: "دنبال کردن",
      description: "مارا در یوتیوب و اینستاگرام و تلگرام دنبال کن !",
      achieved: true,
      ranked: true,
      rankGroup: "social",
    },
    {
      id: "badge6",
      image: "/badge4.png",
      title: "انجام تمارین",
      description: "انجام حداقل ۹۰ درصد از تمارین",
      achieved: true,
      ranked: false,
    },
  ], []);

  const displayBadges = badges.length > 0 ? badges : defaultBadges;

  const handlePrevious = (badgeId, rankGroup) => {
    // Logic for cycling through ranked badges
    console.log("Previous badge in group:", rankGroup);
  };

  const handleNext = (badgeId, rankGroup) => {
    // Logic for cycling through ranked badges
    console.log("Next badge in group:", rankGroup);
  };

  return (
    <section className="w-full py-20" aria-label="دستاوردها">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <h2 className="text-3xl font-black text-text-charcoal text-center mb-12">
          دستاوردهای شما
        </h2>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {displayBadges.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              showNavigation={badge.ranked}
              onPrevious={() => handlePrevious(badge.id, badge.rankGroup)}
              onNext={() => handleNext(badge.id, badge.rankGroup)}
            />
          ))}
        </div>

        {/* Achievement Stats */}
        <div className="mt-12 text-center">
          <p className="text-text-gray text-sm">
            شما{" "}
            <span className="font-bold text-primary">
              {displayBadges.filter((b) => b.achieved).length}
            </span>{" "}
            از{" "}
            <span className="font-bold text-text-charcoal">
              {displayBadges.length}
            </span>{" "}
            نشان را کسب کرده‌اید
          </p>
        </div>
      </div>
    </section>
  );
}

