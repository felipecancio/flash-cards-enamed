import { SimuladoApp } from "@/components/simulados/SimuladoApp";
import source from "@/data/enamed_cases_200_source_for_cursor.json";
import { parseCases } from "@/lib/simulado";
import type { Metadata } from "next";

const cases = parseCases(source);

export const metadata: Metadata = {
  title: "Mini-simulado",
  description: "Treino com questões dos 200 casos. A correção aparece ao finalizar.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/simulados" },
  openGraph: {
    title: "Mini-simulado",
    description: "Treino com questões dos 200 casos. A correção aparece ao finalizar.",
  },
};

export default function SimuladosPage() {
  return (
    <div className="min-h-full overflow-x-clip bg-paper">
      <SimuladoApp cases={cases} />
    </div>
  );
}
