import Image from "next/image";

interface SoftwareCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export default function SoftwareCard({
  title,
  description,
}: SoftwareCardProps) {
  // Split description by double newlines to create paragraphs
  const paragraphs = description.split("\n\n").filter((p) => p.trim());

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-2xl font-bold text-black mb-4 text-center">
          {title}
        </h3>

        {/* Description - with proper paragraph spacing */}
        <div className="space-y-3">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-base text-foreground leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
