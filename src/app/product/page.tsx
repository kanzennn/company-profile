import type { Metadata } from "next";
import { UnderDevelopment } from "../_components/under-development";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Products from Kervzent Studio — what we build for web, mobile, and AI.",
};

export default function ProductPage() {
  return (
    <UnderDevelopment
      title="Our Product"
      description="This page is in progress. It'll break down what we build across web, mobile, and AI, and how each piece fits together."
    />
  );
}
