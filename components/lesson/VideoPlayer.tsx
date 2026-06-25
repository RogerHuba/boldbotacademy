export function VideoPlayer({ youtubeId }: { youtubeId: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-black">
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="Lesson video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full"
        />
      </div>
    </div>
  );
}
