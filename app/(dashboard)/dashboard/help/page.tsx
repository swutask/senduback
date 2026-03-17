"use client";

import { faqData } from "@/components/common/faq-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Headphones,
} from "lucide-react";
import Link from "next/link";

export default function HelpCenterPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <h1 className="text-2xl font-semibold">Help Center</h1>

      {/* Top Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Quick Guides */}
        <Card className="hover:shadow-md transition">
          <CardContent className="p-6 flex gap-4">
            <IconBox color="bg-blue-100 text-blue-600">
              <BookOpen />
            </IconBox>
            <div>
              <h3 className="font-medium">Quick Guides</h3>
              <p className="text-sm text-muted-foreground">
                Learn the basics <br /> and get started
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="hover:shadow-md transition">
          <CardContent className="p-6 flex gap-4">
            <IconBox color="bg-blue-100 text-blue-600">
              <Headphones />
            </IconBox>
            <div>
              <h3 className="font-medium">Contact Support</h3>
              <p className="text-sm text-blue-600">support@senduback.com</p>
              <p className="text-sm text-muted-foreground">+44 7123 456789</p>
            </div>
          </CardContent>
        </Card>

        {/* Report a Problem */}
        <Card className="hover:shadow-md transition">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex gap-4">
              <IconBox color="bg-red-100 text-red-600">
                <AlertTriangle />
              </IconBox>
              <div>
                <h3 className="font-medium">Report a Problem</h3>
                <p className="text-sm text-muted-foreground">
                  Have an issue? Submit a ticket.
                </p>
              </div>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Submit Ticket
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">FAQ</h2>

        <Accordion type="single" collapsible className="space-y-3">
          {faqData.map((section) =>
            section.items.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border rounded-lg px-4 border!"
              >
                <AccordionTrigger className="text-left text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            )),
          )}
        </Accordion>
      </section>

      {/* Useful Links */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Useful Links</h2>

        <div className="flex flex-wrap gap-3">
          <Link href={"/privacy-policy"}>
            <LinkButton label="Privacy Policy" />
          </Link>
          <Link href={"/terms-conditions"}>
            <LinkButton label="Terms & Conditions" />
          </Link>
          <Link href={"/refund-policy "}>
            <LinkButton label="Refund Policy" />
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function IconBox({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}
    >
      {children}
    </div>
  );
}

function LinkButton({ label }: { label: string }) {
  return (
    <Button variant="outline" className="gap-2">
      {label}
      <ExternalLink size={16} />
    </Button>
  );
}
