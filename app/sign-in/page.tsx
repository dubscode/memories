import { SignIn } from '@clerk/nextjs';

export default function SignInPage({
  searchParams,
}: {
  searchParams: { redirectUrl?: string | null };
}) {
  return <SignIn forceRedirectUrl={searchParams.redirectUrl ?? '/'} />;
}
