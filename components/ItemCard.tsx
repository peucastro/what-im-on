import Image from 'next/image';

interface Item {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
}

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { title, description, image_url: imageUrl } = item;

  return (
    <div className="rounded-app border border-app-border bg-app-nav p-6 mb-4">
      {imageUrl && (
        <div className="relative mb-4 h-48 w-full overflow-hidden rounded-app">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        </div>
      )}
      <h3 className="text-lg font-bold text-app-font">{title}</h3>
      {description && <p className="mt-2 text-sm text-app-font opacity-80">{description}</p>}
    </div>
  );
}
