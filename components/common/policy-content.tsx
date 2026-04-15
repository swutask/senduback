"use client";

import {
  BulletItem,
  LAST_UPDATED,
  POLICY_DATA,
  POLICY_TYPE,
} from "@/lib/policy-data";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

function SectionBadge({ number }: { number: number }) {
  return (
    <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-500">
      {number}
    </span>
  );
}

function BulletList({ items }: { items: BulletItem[] }) {
  return (
    <ul className="mt-3 space-y-2.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-2 text-[1rem] leading-relaxed text-gray-700"
        >
          <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-700" />
          <span>
            <strong className="font-semibold text-gray-900 mr-1">
              {item.label}
            </strong>
            {item.text ? (
              <span dangerouslySetInnerHTML={{ __html: item.text }} />
            ) : (
              ""
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

function SimpleList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "mt-3 space-y-2 text-[1rem] leading-relaxed text-gray-700",
        className,
      )}
    >
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-700" />
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}

function Paragraph({ html, className }: { html: string; className?: string }) {
  return (
    <p
      className={cn("text-[1rem] leading-relaxed text-gray-700", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function PolicyContent({
  type = "privacy",
}: {
  type?: POLICY_TYPE;
}) {
  const SECTIONS = POLICY_DATA[type];
  if (!SECTIONS?.length) return null;

  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.getAttribute("data-section-id");
          if (id) setActiveId(id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-white px-4 py-24">
      <div className="mx-auto flex max-w-[850px] gap-10">
        <div className="min-w-0 flex-1">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10">
            <p className="mb-8 text-[13px] text-gray-400">
              Last updated: {LAST_UPDATED}
            </p>

            <div className="space-y-4">
              {SECTIONS.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  data-section-id={section.id}
                  ref={(el) => {
                    sectionRefs.current[section.id] = el;
                  }}
                  className="pt-5 first:pt-0"
                >
                  {/* Section heading */}
                  <div className="mb-4 flex items-center gap-3">
                    <SectionBadge number={section.number} />
                    <h2 className="text-[17px] font-bold text-blue-500">
                      {section.title}
                    </h2>
                  </div>

                  {/* Content */}
                  <div className="space-y-3 pl-1">
                    {section.intro && <Paragraph html={section.intro} />}

                    {section.bullets && <BulletList items={section.bullets} />}

                    {section.listItems && (
                      <SimpleList items={section.listItems} />
                    )}

                    {section.paragraphs?.map((p, i) => {
                      if (typeof p === "string")
                        return <Paragraph key={i} html={p} />;
                      return (
                        <div>
                          <Paragraph key={i} html={p.text} />
                          {p?.list?.length && (
                            <SimpleList
                              items={p?.list}
                              className="ml-2 text-[15px] font-medium"
                            />
                          )}
                        </div>
                      );
                    })}

                    {section.id === "contact" &&
                      section.contactBlocks?.map((s) => (
                        <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 px-5 py-4">
                          <p className="mb-2 text-[14px] font-semibold text-gray-800">
                            {s.label}
                          </p>
                          <div className="space-y-1 text-[13px] text-gray-600">
                            {s.paragraphs?.map((p, i) => (
                              <Paragraph
                                key={i}
                                html={p}
                                className="text-[14px]"
                              />
                            ))}
                          </div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: s?.rawContent || "",
                            }}
                          />
                          {s.outro && (
                            <p
                              className="text-[1rem] leading-relaxed text-gray-700"
                              dangerouslySetInnerHTML={{ __html: s.outro }}
                            />
                          )}
                        </div>
                      ))}

                    {section.outro && (
                      <p
                        className="text-[1rem] leading-relaxed text-gray-700"
                        dangerouslySetInnerHTML={{ __html: section.outro }}
                      />
                    )}

                    {section.infoBlocks?.map((s) => (
                      <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 px-5 py-4">
                        <p className="mb-2 text-[1rem] font-semibold text-gray-800">
                          {s.label}
                        </p>
                        <div className="space-y-1 text-[14px] text-gray-600">
                          {s.paragraphs?.map((p, i) => (
                            <Paragraph
                              key={i}
                              html={p}
                              className="text-[14px]"
                            />
                          ))}
                        </div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: s?.rawContent || "",
                          }}
                        />
                        {s.outro && (
                          <p
                            className="text-[1rem] leading-relaxed text-gray-700"
                            dangerouslySetInnerHTML={{ __html: s.outro }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
