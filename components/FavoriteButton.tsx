"use client";

import { useFavorites } from "@/lib/favorites";

export default function FavoriteButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const { ids, toggle } = useFavorites();
  const isFavorite = ids.includes(id);

  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={`rounded-md px-2 text-xl leading-none ${
        isFavorite
          ? "text-amber-500"
          : "text-zinc-300 hover:text-amber-400"
      }`}
    >
      {isFavorite ? "★" : "☆"}
    </button>
  );
}
