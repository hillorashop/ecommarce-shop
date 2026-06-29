import Image from "next/image";

export const ShareButtons = ({ title, url }: { title: string; url: string }) => {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      bg: "#1877F2",
      icon: <Image src="/icons/facebook.svg" alt="Facebook" width={22} height={22} />,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
      bg: "#3CC217",
      icon: <Image src="/icons/whatsapp.svg" alt="WhatsApp" width={22} height={22} />,
    },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm font-semibold text-muted-foreground">
        শেয়ার করুন:
      </span>
      {links.map(({ label, href, icon, bg }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          style={{ backgroundColor: bg }}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 hover:scale-110 transition-all"
        >
          {icon}
        </a>
      ))}
    </div>
  );
};