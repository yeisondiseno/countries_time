import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>No encontramos la página · Not found</h1>
      <p>
        Vuelve al inicio (<Link href="/en">/en</Link>) o revisa que el prefijo
        de idioma sea válido.
      </p>
    </main>
  );
}
