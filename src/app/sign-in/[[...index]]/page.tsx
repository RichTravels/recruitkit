import { SignIn } from "@clerk/nextjs";

const clerkAppearance = {
  layout: {
    unsafe_disableDevelopmentModeWarnings: true,
  },
};

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn path="/sign-in" appearance={clerkAppearance} />
    </div>
  );
}