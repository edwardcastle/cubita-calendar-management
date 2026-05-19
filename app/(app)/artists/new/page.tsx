import { ArtistForm } from "./ArtistForm";

export default function NewArtistPage() {
  return (
    <section className="px-4 py-6 space-y-6">
      <h2 className="text-lg font-semibold">Nuevo artista</h2>
      <ArtistForm />
    </section>
  );
}
