"use client";
import { Button } from "@nextui-org/react";
import { ThumbsUpIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { signIn, useSession } from "@/lib/auth-client";
import clsx from "clsx";

import { Site } from "@/models/site";
import { isUserUpVoteSite, triggerUpvoteSite } from "@/lib/actions";

export default function VoteButton({ site }: { site: Site }) {
  const t = useTranslations("site");
  const { data: session } = useSession();
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [voteCount, setVoteCount] = useState(site.voteCount);
  const [isLoading, setIsLoading] = useState(false);

  const triggerUpvote = async () => {
    try {
      if (isLoading) {
        return;
      }
      setIsLoading(true);
      const { count, upvoted } = await triggerUpvoteSite(site._id);

      setIsUpvoted(upvoted);
      setVoteCount(count);
    } catch {
      toast.error(t("voteFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const update = async () => {
      setVoteCount(site.voteCount);
      if (session?.user?.id) {
        setIsUpvoted(await isUserUpVoteSite(site._id));
      }
    };

    update().finally(() => {
      setIsLoading(false);
    });
  }, [session, site]);

  const button = (
    <Button
      className={clsx("w-full sm:w-48 font-medium text-sm py-4 shadow-md hover:shadow-lg transition-all duration-300", {
        "!text-primary-50": isUpvoted,
      })}
      color="success"
      isLoading={isLoading}
      radius="md"
      size="md"
      variant={isUpvoted ? "solid" : "bordered"}
      onClick={session ? triggerUpvote : async () => {
        // Redirect to Better Auth signin page
        const baseUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || '';
        const signinUrl = `${baseUrl}/signin?callbackURL=${encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL || '')}`;
        window.location.href = signinUrl;
      }}
    >
      <ThumbsUpIcon size={14} strokeWidth={2.5} />
      {t("upvote")}
      {voteCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">{voteCount}</span>}
    </Button>
  );

  return button;
}
