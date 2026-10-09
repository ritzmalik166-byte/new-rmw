import type { ServiceDetail, ServiceFaq, ServicePoint } from "@/lib/services-data";

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

const DEFAULT_FLAGS: ServicePoint[] = [
  {
    title: "Noise without recall",
    copy: "Work that looks like everyone else's gets scrolled past and forgotten before it can sell.",
  },
  {
    title: "Spend without a system",
    copy: "When strategy, creative and media are planned in silos, budget leaks between them.",
  },
  {
    title: "Reports without answers",
    copy: "If you cannot see what actually moved enquiries, you cannot decide what to do next.",
  },
];

function defaultFaqs(service: ServiceDetail): ServiceFaq[] {
  const scope = service.capabilities
    .slice(0, 4)
    .map((cap) => cap.title.toLowerCase())
    .join(", ");

  return [
    {
      question: `What does ${service.name} from RMW include?`,
      answer: `Depending on your goals, the scope can cover ${scope} and more. The final scope is confirmed once we understand your brand, audience and objectives.`,
    },
    {
      question: "How soon will we see results?",
      answer:
        "It depends on your starting point, market and the work involved. We agree milestones up front and review progress against them at every stage.",
    },
    {
      question: "Is the work handled in-house?",
      answer:
        "Yes. Strategy, creative, production and media sit under one roof in Noida, so the idea, the execution and the reporting stay connected.",
    },
    {
      question: `Can ${service.name} work alongside our other marketing?`,
      answer:
        "Yes. We plan it to fit your existing channels and teams, and can bring in our other engines where they add value.",
    },
    {
      question: "What will I see in your reports?",
      answer:
        "Clear reporting on the metrics that matter to your business, together with the work completed and the next steps for the agreed programme.",
    },
  ];
}

export function getServiceLayout(service: ServiceDetail) {
  const layout = service.layout ?? {};
  const parts = service.capabilities.length;

  return {
    problemSummary: layout.problemSummary ?? service.problemCopy ?? service.shortDescription,
    problemFlags: layout.problemFlags ?? DEFAULT_FLAGS,
    planKicker: layout.planKicker ?? `${service.name} services`,
    planTitle: `${NUMBER_WORDS[parts] ?? parts} parts.`,
    planLede:
      layout.planLede ?? `Explore the work behind a complete ${service.name.toLowerCase()} programme.`,
    planCta: layout.planCta ?? `Let's discuss your ${service.name} scope`,
    intentTitle: layout.intentTitle ?? { lead: `Why ${service.name}`, accent: "moves the needle." },
    intentPoints: layout.intentPoints ?? service.whyUs.slice(0, 3),
    intentTape: layout.intentTape ?? (["Ideas that travel", "Horn ओके please"] as [string, string]),
    requirementsSign: layout.requirementsSign,
    faqs: layout.faqs ?? defaultFaqs(service),
  };
}

export type ServiceLayout = ReturnType<typeof getServiceLayout>;
