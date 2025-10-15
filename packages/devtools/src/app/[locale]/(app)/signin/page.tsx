import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";

import Container from "@/components/common/container";
import SignInForm from "@/components/auth/signin-form";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "signin",
  });

  return {
    title: t("title"),
  };
}

export default async function SignIn({
  searchParams,
}: {
  searchParams: { callbackURL?: string };
}) {
  const session = await getSession();

  if (session) {
    // If user is already signed in, redirect to callback URL or home
    redirect(searchParams.callbackURL || "/");
  }

  return (
    <Container>
      <SignInForm callbackURL={searchParams.callbackURL} />
    </Container>
  );
}