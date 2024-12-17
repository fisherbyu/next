import type { Metadata } from "next";
import PageTitle from "@/components/ui/page-title";
import DisplayPhotos from "./displayPhotos";

const title = {
  title: "My Photography",
  subtitle: "Here are some of my photos I've taken over the years. I got interested in photography because my sister is an amazing photographer and I love capturing moments."
};

export default async function PhotographyPage() {

  return (
    <main>
      <PageTitle components={title} />
      <DisplayPhotos />
    </main>
  );
}

export const metadata: Metadata = {
  title: "My Photography"
};