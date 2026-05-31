import Card from "@/components/Card";

interface StepCardProps {
  number: string;
  title: string;
  bullets: string[];
}

export default function StepCard({ number, title, bullets }: StepCardProps) {
  return (
    <Card
      className="flex-1 flex flex-col gap-2"
      borderClassName="border-dark"
      shadowClassName="shadow-[8px_8px_0px_#dfff92]"
    >
      <p className="font-press text-lavender text-[32px] leading-10 [text-shadow:-2px_2px_0px_#1d1d1f]">
        {number}
      </p>
      <div className="flex flex-col gap-4 text-dark">
        <h3 className="font-ramillas font-black text-[32px] leading-10">{title}</h3>
        <ul className="font-nunito font-light text-lg leading-7 list-disc pl-6 flex flex-col gap-1">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
}