import {
  Award,
  AtSign,
  Briefcase,
  Building2,
  Clock,
  GraduationCap,
  Globe,
  HeartHandshake,
  Languages as LanguagesIcon,
  Link as LinkIcon,
  Mail,
  Phone,
} from "lucide-react";

import { Avatar } from "@/components/public/avatar";
import { dateRange, groupWorkHours, monthYear, yearRange } from "@/lib/format";
import { sanitizeBioHtml } from "@/lib/sanitize";
import type { PublicProfile } from "@/lib/public-types";

// LinkedIn-style read-only public profile (plan §5). Renders only the
// privacy-filtered fields the backend returned.
export function ProfileView({ profile }: { profile: PublicProfile }) {
  const bio = sanitizeBioHtml(profile.bio);
  const contact = profile.contact;
  const hasContact =
    contact.labEmail ||
    contact.personalEmail ||
    contact.phone ||
    contact.website ||
    contact.portfolio ||
    contact.linkedin ||
    contact.github ||
    profile.socialLinks.length > 0;

  return (
    <article className="flex flex-col gap-6">
      {/* Banner + identity */}
      <header className="border-line bg-surface shadow-1 overflow-hidden rounded-xl border">
        <div className="bg-surface-muted relative h-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.bannerUrl} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-12 mb-3">
            <Avatar
              src={profile.avatarUrl}
              name={profile.name}
              size={96}
              className="ring-surface ring-4"
            />
          </div>
          <h1 className="font-display text-display-lg text-ink">
            {profile.name || profile.nickname || profile.slug}
          </h1>
          {profile.headline && <p className="text-body text-ink-2 mt-1">{profile.headline}</p>}
          <p className="text-caption text-ink-3 mt-2">{profile.division}</p>
        </div>
      </header>

      {bio && (
        <Section icon={<Briefcase size={18} strokeWidth={2.25} />} title="About">
          <div
            className="prose-measure text-body-sm text-ink-2 [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal"
            // Sanitized above (allowlisted tags, no attributes).
            dangerouslySetInnerHTML={{ __html: bio }}
          />
        </Section>
      )}

      {hasContact && (
        <Section icon={<LinkIcon size={18} strokeWidth={2.25} />} title="Contact & links">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {contact.labEmail && (
              <ContactItem
                icon={<Mail size={15} strokeWidth={2.25} />}
                text={contact.labEmail}
                href={`mailto:${contact.labEmail}`}
              />
            )}
            {contact.personalEmail && (
              <ContactItem
                icon={<Mail size={15} strokeWidth={2.25} />}
                text={contact.personalEmail}
                href={`mailto:${contact.personalEmail}`}
              />
            )}
            {contact.phone && (
              <ContactItem icon={<Phone size={15} strokeWidth={2.25} />} text={contact.phone} />
            )}
            {contact.website && (
              <ContactItem
                icon={<Globe size={15} strokeWidth={2.25} />}
                text="Website"
                href={contact.website}
              />
            )}
            {contact.portfolio && (
              <ContactItem
                icon={<Globe size={15} strokeWidth={2.25} />}
                text="Portfolio"
                href={contact.portfolio}
              />
            )}
            {contact.linkedin && (
              <ContactItem
                icon={<LinkIcon size={15} strokeWidth={2.25} />}
                text="LinkedIn"
                href={contact.linkedin}
              />
            )}
            {contact.github && (
              <ContactItem
                icon={<LinkIcon size={15} strokeWidth={2.25} />}
                text="GitHub"
                href={contact.github}
              />
            )}
            {profile.socialLinks.map((l) => (
              <ContactItem
                key={l.id}
                icon={
                  l.kind === "instagram" ? (
                    <AtSign size={15} strokeWidth={2.25} />
                  ) : (
                    <LinkIcon size={15} strokeWidth={2.25} />
                  )
                }
                text={l.label || l.kind}
                href={l.url}
              />
            ))}
          </ul>
        </Section>
      )}

      {profile.experiences.length > 0 && (
        <Section icon={<Briefcase size={18} strokeWidth={2.25} />} title="Experience">
          {profile.experiences.map((e) => (
            <Entry
              key={e.id}
              title={e.title}
              subtitle={[e.company, e.employmentType].filter(Boolean).join(" · ")}
              meta={[
                dateRange({ ...e, current: e.currentlyWorking }),
                [e.location, e.locationType].filter(Boolean).join(" · "),
              ]
                .filter(Boolean)
                .join(" — ")}
              body={e.description}
              tags={e.skills}
            />
          ))}
        </Section>
      )}

      {profile.education.length > 0 && (
        <Section icon={<GraduationCap size={18} strokeWidth={2.25} />} title="Education">
          {profile.education.map((e) => (
            <Entry
              key={e.id}
              title={e.school}
              subtitle={[e.degree, e.fieldOfStudy].filter(Boolean).join(", ")}
              meta={[yearRange(e.startYear, e.endYear), e.grade && `Grade: ${e.grade}`]
                .filter(Boolean)
                .join(" — ")}
              body={[e.activitiesAndSocieties, e.description].filter(Boolean).join("\n\n")}
            />
          ))}
        </Section>
      )}

      {profile.certifications.length > 0 && (
        <Section icon={<Award size={18} strokeWidth={2.25} />} title="Licenses & certifications">
          {profile.certifications.map((c) => (
            <Entry
              key={c.id}
              title={c.name}
              subtitle={c.issuingOrganization}
              meta={[
                monthYear(c.issueMonth, c.issueYear) &&
                  `Issued ${monthYear(c.issueMonth, c.issueYear)}`,
                c.doesNotExpire
                  ? "No expiration"
                  : monthYear(c.expirationMonth, c.expirationYear) &&
                    `Expires ${monthYear(c.expirationMonth, c.expirationYear)}`,
                c.credentialId && `ID: ${c.credentialId}`,
              ]
                .filter(Boolean)
                .join(" · ")}
            />
          ))}
        </Section>
      )}

      {profile.volunteering.length > 0 && (
        <Section icon={<HeartHandshake size={18} strokeWidth={2.25} />} title="Volunteering">
          {profile.volunteering.map((v) => (
            <Entry
              key={v.id}
              title={[v.role, v.organization].filter(Boolean).join(" · ")}
              subtitle={v.cause}
              meta={dateRange({ ...v, current: v.currentlyActive })}
              body={v.description}
            />
          ))}
        </Section>
      )}

      {profile.organizations.length > 0 && (
        <Section icon={<Building2 size={18} strokeWidth={2.25} />} title="Organizations">
          {profile.organizations.map((o) => (
            <Entry
              key={o.id}
              title={[o.role, o.name].filter(Boolean).join(" · ")}
              meta={dateRange({ ...o })}
              body={o.description}
            />
          ))}
        </Section>
      )}

      {profile.skills.length > 0 && (
        <Section icon={<Award size={18} strokeWidth={2.25} />} title="Skills">
          <TagList items={profile.skills.map((s) => s.name)} />
        </Section>
      )}

      {profile.techStack.length > 0 && (
        <Section icon={<Briefcase size={18} strokeWidth={2.25} />} title="Tech stack">
          <ul className="flex flex-wrap gap-2">
            {profile.techStack.map((t) => (
              <li
                key={t.id}
                className="border-line bg-surface text-body-sm text-ink-2 rounded-full border px-3 py-1"
              >
                {t.name}
                <span className="text-ink-4 text-caption ml-1.5">{t.proficiency}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {profile.languages.length > 0 && (
        <Section icon={<LanguagesIcon size={18} strokeWidth={2.25} />} title="Languages">
          <ul className="flex flex-col gap-1.5">
            {profile.languages.map((l) => (
              <li key={l.id} className="text-body-sm text-ink-2 flex items-center justify-between">
                <span className="text-ink">{l.language}</span>
                <span className="text-ink-3 text-caption">{l.proficiency}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {profile.workHours.length > 0 && (
        <Section icon={<Clock size={18} strokeWidth={2.25} />} title="Work hours (GMT+7)">
          <ul className="flex flex-col gap-1.5">
            {groupWorkHours(profile.workHours).map((row) => (
              <li key={row.day} className="text-body-sm flex items-center justify-between gap-4">
                <span className="text-ink-2 w-24">{row.day}</span>
                <span className="text-ink-3 text-caption tabular-nums">
                  {row.ranges.join(", ")}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </article>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-line bg-surface shadow-1 rounded-xl border p-6">
      <h2 className="font-display text-h3 text-ink mb-4 flex items-center gap-2">
        <span className="text-ink-3">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Entry({
  title,
  subtitle,
  meta,
  body,
  tags,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  body?: string;
  tags?: string[];
}) {
  return (
    <div className="border-line not-last:mb-4 not-last:border-b not-last:pb-4">
      <p className="text-body-sm text-ink font-medium">{title}</p>
      {subtitle && <p className="text-body-sm text-ink-2">{subtitle}</p>}
      {meta && <p className="text-caption text-ink-3 mt-0.5">{meta}</p>}
      {body && <p className="text-body-sm text-ink-2 mt-2 whitespace-pre-line">{body}</p>}
      {tags && tags.length > 0 && <TagList items={tags} className="mt-2" />}
    </div>
  );
}

function TagList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      {items.map((t) => (
        <li
          key={t}
          className="border-line bg-surface-muted text-caption text-ink-2 rounded-full border px-3 py-1"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

function ContactItem({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) {
  const inner = (
    <span className="text-body-sm text-ink-2 inline-flex items-center gap-1.5">
      <span className="text-ink-3">{icon}</span>
      {text}
    </span>
  );
  return (
    <li>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="hover:text-brand-blue transition-colors duration-200"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </li>
  );
}
