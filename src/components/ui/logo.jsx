import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"} className="flex items-center">
      <div className="min-w-8 p-2 rounded-md">
        <Image
          src="/logo.png"
          width={400}
          height={400}
          alt="logo"
          className="w-10 h-10"
        />
      </div>

      <h1 className="font-bold text-xl font-sans">
        Cold<span className="text-primary">Flyer</span>
      </h1>
    </Link>
  );
}
