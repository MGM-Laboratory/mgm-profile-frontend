import Link from "next/link";

import { Avatar } from "@/components/public/avatar";
import type { PublicMember } from "@/lib/public-types";

// Directory card: avatar, name, division, headline (plan §5). Links to the
// public profile by slug.
export function MemberCard({ member }: { member: PublicMember }) {
  return (
    <Link
      href={`/${member.slug}`}
      className="group border-line bg-surface hover:shadow-2 ease-out-soft flex items-center gap-4 rounded-lg border p-4 transition-shadow duration-200"
    >
      <Avatar src={member.avatarUrl} name={member.name} size={56} />
      <div className="min-w-0">
        <p className="text-body-sm text-ink group-hover:text-brand-blue truncate font-medium transition-colors duration-200">
          {member.name || member.nickname || member.slug}
        </p>
        <p className="text-caption text-ink-3 truncate">{member.division}</p>
        {member.headline && (
          <p className="text-caption text-ink-2 mt-0.5 truncate">{member.headline}</p>
        )}
      </div>
    </Link>
  );
}
