import { AulifyBadge, AulifyButton, AulifyCard, AulifyContainer, AulifySection } from "@aulify/ui";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-offWhite text-neutral-black">
      <AulifySection>
        <AulifyContainer className="max-w-4xl">
          <AulifyCard className="grid gap-6">
            <div className="grid gap-3">
              <AulifyBadge>Landing</AulifyBadge>
              <h1 className="m-0 text-3xl font-semibold text-neutral-black">Aulify public app placeholder</h1>
              <p className="m-0 max-w-2xl text-base text-neutral-darkGray">
                Inter, official colors, Tailwind tokens, and shared UI components are ready for the future landing page.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <AulifyButton>Primary button</AulifyButton>
              <AulifyButton variant="secondary">Secondary button</AulifyButton>
              <AulifyButton variant="ghost">Ghost button</AulifyButton>
            </div>
          </AulifyCard>
        </AulifyContainer>
      </AulifySection>
    </main>
  );
}
