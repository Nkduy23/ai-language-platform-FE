// Bìa hộ chiếu — panel bên trái dùng chung cho Login/Register (§4.4 skill)
import PostmarkStamp from "@/components/shared/motifs/PostmarkStamp";

interface AuthPassportPanelProps {
  title: React.ReactNode;
  subtitle: string;
  children?: React.ReactNode;
}

export default function AuthPassportPanel({ title, subtitle, children }: AuthPassportPanelProps) {
  return (
    <div className="relative hidden md:flex flex-col justify-center bg-ink-navy overflow-hidden px-10 lg:px-14 py-12">
      {/* Texture chấm mờ thay placeholder cho world-map line-art */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: "radial-gradient(#F5EFE0 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

      {/* Vài con dấu trang trí rải rác, như hộ chiếu đã dùng nhiều */}
      <PostmarkStamp label="STAMP TEAL •" color="stamp-teal" size={64} rotate={12} className="absolute top-10 right-10 opacity-40">
        EN
      </PostmarkStamp>
      <PostmarkStamp label="GOLD FOIL •" color="gold-foil" size={56} rotate={-16} className="absolute bottom-16 right-24 opacity-30">
        日
      </PostmarkStamp>

      <div className="relative z-10 max-w-sm">
        <div className="w-14 h-14 bg-airmail rounded-md flex items-center justify-center shadow-stamp mb-6">
          <span className="text-2xl">🌐</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-display font-bold text-postcard mb-3 leading-snug">{title}</h2>
        <p className="text-postcard/70 text-sm lg:text-base">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
