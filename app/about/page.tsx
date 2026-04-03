import Navbar from "../../components/Navbar";
import { AboutPageWrapper } from "../../components/about/AboutPageWrapper";

export const metadata = {
  title: "About Us | Atlas Synapse",
  description: "Atlas Synapse — we hold the integrity layer. We inspect the signal at the boundary. Governance, regulation, auditability, and reliability for AI systems.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AboutPageWrapper />
    </>
  );
}
