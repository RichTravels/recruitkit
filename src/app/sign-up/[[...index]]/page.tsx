import { SignUp } from "@clerk/nextjs";

const clerkAppearance = {
  layout: {
    unsafe_disableDevelopmentModeWarnings: true,
  },
};

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp path="/sign-up" appearance={clerkAppearance} />
    </div>
  );
}