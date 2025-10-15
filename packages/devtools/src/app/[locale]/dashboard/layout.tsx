"use client";
import { useTranslations } from "next-intl";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useEffect } from "react";
import Logo from "@/components/common/logo";
import { ThemeSwitcher } from "@/components/common/theme-switcher";
import { Link, usePathname } from "@/navigation";
import LanguageSwitcher from "@/components/common/language-switcher";
import { AppConfig } from "@/lib/config";

export default function DashbpardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("dashboard");

  // Check if user is a manager
  const isManager = session?.user?.id && AppConfig.manageUsers.includes(session.user.id);

  useEffect(() => {
    if (isPending) return;
    
    if (!session) {
      router.push("/signin");
      return;
    }

    // Check if user is authorized to access dashboard
    if (!isManager) {
      router.push("/"); // Redirect to home page if not a manager
      return;
    }
  }, [session, isPending, isManager, router]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  // Don't render dashboard if user is not authenticated or not a manager
  if (!session || !isManager) {
    return null;
  }

  const menus = [
    {
      title: t("siteManage"),
      link: "/dashboard/site-manage",
    },
    {
      title: t("reviewManage"),
      link: "/dashboard/review-manage",
    },
    {
      title: t("categoryManage"),
      link: "/dashboard/category-manage",
    },
  ];

  return (
    <div className="flex w-screen h-screen">
      <div className="flex-shrink-0 flex-grow-0 basis-48 h-full p-6 border-r-1 border-primary-300 flex flex-col">
        <Logo />

        <div className="flex-shrink-0 flex-grow-0 basis-[2px] my-10 bg-gradient-to-r from-primary-300 via-primary-900 to-primary-300 rounded-[999px/10px]" />

        <div className="flex-1 px-1 text-primary-600 space-y-3">
          {menus.map((menu, index) => {
            const active = pathname === menu.link;

            return (
              <Link
                key={index}
                className={clsx(
                  "px-4 py-2 rounded-lg bg-primary-100 text-sm font-semibold hover:bg-primary-200 hover:text-primary-800 cursor-pointer transition-all",
                  "block",
                  {
                    "!bg-primary !text-primary-foreground": active,
                  },
                )}
                href={menu.link}
              >
                {menu.title}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-6 gap-2">
          <span className="text-sm text-gray-700">{session?.user?.name}</span>
          <div className="flex-1" />
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
