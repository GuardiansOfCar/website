"use client";

import { Main } from "@/app/v2/components/main";
import { FaqSection } from "@/app/v2/[locale]/faq/components/section";
import { useState } from "react";

const FAQ_ITEMS = [
  {
    question: "What makes GOTCAR unique?",
    answer: (
      <>
        By utilizing open data, GOTCAR builds an AI-based precision vehicle positioning service that provides 99% cost savings compared to existing autonomous or HD map technologies.
        <br />
        <br />
        Our goal is to make such advanced systems accessible to all vehicles and all environments, not limited to specific models or areas.
      </>
    ),
  },
  {
    question: "What is the utility of the $GOTCAR token?",
    answer: (
      <>
        $GOTCAR is used for mobility-related payments such as fueling, parking, charging, and insurance,
        <br />
        <br />
        as well as for G2E (Guardians-to-Earn) rewards, staking, and community incentives within the ecosystem.
      </>
    ),
  },
  {
    question: "How does GOTCAR use AI technology?",
    answer: (
      <>
        The AI Agent analyzes driving behavior, road hazards, and weather conditions in real time,
        <br />
        <br />
        providing lane-level navigation, indoor parking guidance, and accident alerts.
        <br />
        It detects and warns drivers about risks that are difficult to see or react to visually.
      </>
    ),
  },
  {
    question: "When can I claim my $GOTCAR tokens?",
    answer: (
      <>
        You can claim your tokens immediately upon the official launch.
        <br />
        <br />
        The token launch and global CEX listings are planned between Q4 2025 and Q1 2026, with the claim period opening on the same schedule.
      </>
    ),
  },
  {
    question: "How do I stake $GOTCAR?",
    answer: (
      <>
        Staking begins by depositing $GOTCAR through the official website.
        <br />
        <br />
        Rewards vary depending on the amount and duration of your stake.
      </>
    ),
  },
  {
    question: "What is Guardians-to-Earn (G2E)?",
    answer: (
      <>
        Drivers contribute their driving data, which the AI analyzes to assess safety and accident risks.
        <br />
        <br />
        Participants are rewarded in tokens based on their contribution to traffic safety — making every driver a Guardian of the GOTCAR ecosystem.
      </>
    ),
  },
  {
    question: "What are GOTCAR's future partnership plans?",
    answer: (
      <>
        GOTCAR is pursuing integrations with global automakers such as Toyota, Hyundai, and Tesla,
        <br />
        as well as navigation and payment platforms like Google and Apple.
        <br />
        <br />
        Our long-term goal is to deliver AI-powered safety and convenience services directly within real-world vehicle systems.
      </>
    ),
  },
];

export const FaqContainer = ({ hideBuy, hideNav }: { hideBuy?: boolean; hideNav?: boolean }) => {
  const [openIndex, setOpenIndex] = useState<number | undefined>(undefined);

  return (
    <div className={"bg-[#F9FBFB]"}>
      <Main leftHref={hideNav ? "" : "/roadmap"} rightHref={hideNav ? "" : "/staking"} hideNav={hideNav} horizontalPadding={"px-0 max-desktop:px-5"}>
        <div 
          className={"flex flex-col items-center py-10"}
          style={{
            width: "1312px",
            maxWidth: "1312px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h2 className={"text-header-2 text-[#0F0F0F] mb-8 text-center"}>
            FAQ
          </h2>

          <div 
            className={"flex flex-col"}
            style={{
              width: "1312px",
              maxWidth: "1312px",
              gap: "16px",
              paddingBottom: "120px",
            }}
          >
            {FAQ_ITEMS.map((item, index) => (
              <FaqSection
                key={index}
                open={openIndex === index}
                onOpen={(isOpen) => {
                  setOpenIndex(isOpen ? index : undefined);
                }}
                title={item.question}
              >
                {item.answer}
              </FaqSection>
            ))}
          </div>
        </div>
      </Main>
    </div>
  );
};
