'use client';

export default function WorkspaceError({ reset }: { reset: () => void }) {
  return <main className="mx-auto grid min-h-screen max-w-md content-center gap-4 px-6">
    <h1>Could not load Milestone OS</h1>
    <button className="button primary w-fit" onClick={reset}>Try again</button>
  </main>;
}
