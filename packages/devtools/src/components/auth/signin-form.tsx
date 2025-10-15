"use client";
import { Button } from "@nextui-org/react";
import { signIn } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface SignInFormProps {
  callbackURL?: string;
}

export default function SignInForm({ callbackURL }: SignInFormProps) {
  const t = useTranslations("signin");

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">{t("title")}</h1>

      <div className="space-y-4">
        <Button
          className="w-full"
          variant="bordered"
          onClick={async () => {
            await signIn.social({
              provider: "google",
              callbackURL: callbackURL || process.env.NEXT_PUBLIC_APP_URL,
            });
          }}
        >
          <Image src="/social-icons/google.svg" alt="Google" width={20} height={20} />
          {t("continueWithGoogle")}
        </Button>
      </div>
    </div >
  );
}