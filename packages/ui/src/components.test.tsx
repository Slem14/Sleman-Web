import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert } from "./Alert";
import { Badge } from "./Badge";
import { Button, ButtonLink } from "./Button";
import { LanguageCard } from "./LanguageCard";
import { Steps } from "./Steps";

describe("Button", () => {
  it("renders an accessible button with safe default type", () => {
    render(<Button>Continue</Button>);
    const btn = screen.getByRole("button", { name: "Continue" });
    expect(btn).toHaveAttribute("type", "button");
  });

  it("ButtonLink renders an anchor", () => {
    render(<ButtonLink href="/en">Go</ButtonLink>);
    expect(screen.getByRole("link", { name: "Go" })).toHaveAttribute("href", "/en");
  });
});

describe("Alert", () => {
  it("always shows a visible title (never color-only signaling)", () => {
    render(
      <Alert tone="warning" title="Check the deadline">
        Details
      </Alert>,
    );
    expect(screen.getByText("Check the deadline")).toBeInTheDocument();
  });

  it("live danger alerts use role=alert for screen readers", () => {
    render(<Alert tone="danger" title="Failed" live />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("live info alerts use polite role=status", () => {
    render(<Alert tone="info" title="Processing" live />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});

describe("Steps", () => {
  it("renders a semantic ordered list with headings", () => {
    render(
      <Steps
        steps={[
          { title: "One", text: "First" },
          { title: "Two", text: "Second" },
        ]}
      />,
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "One" })).toBeInTheDocument();
  });
});

describe("LanguageCard", () => {
  it("marks the native name with lang and dir attributes", () => {
    render(
      <LanguageCard
        href="/prs"
        nativeName="دری"
        englishName="Dari"
        langTag="prs"
        nativeDir="rtl"
      />,
    );
    const langBlock = screen.getByText("دری").closest("[lang]");
    expect(langBlock).toHaveAttribute("lang", "prs");
    expect(langBlock).toHaveAttribute("dir", "rtl");
    expect(screen.getByRole("link")).toHaveAttribute("href", "/prs");
  });
});

describe("Badge", () => {
  it("renders its label", () => {
    render(<Badge tone="warning">Draft</Badge>);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });
});
