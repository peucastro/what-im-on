import Image from 'next/image';

interface ItemCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
}

export default function ItemCard({ title, description, imageUrl }: ItemCardProps) {
  return (
    <div className="rounded border border-zinc-200 bg-white p-6">
      {imageUrl && (
        <div className="relative mb-4 h-48 w-full overflow-hidden rounded-sm">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <h3 className="text-lg font-bold text-black">{title}</h3>
      {description && <p className="mt-2 text-sm text-zinc-600">{description}</p>}
    </div>
  );
}
