import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"} className="flex items-center gap-2">
      <div className="min-w-8 bg-primary p-2 rounded-md">
        <Image
          src="/vercel.svg"
          width={200}
          height={200}
          alt="logo"
          className="w-4 h-4"
        />
      </div>

      <h1 className="font-bold text-xl font-sans">
        Cold<span className="text-primary">Flyer</span>
      </h1>
    </Link>
  );
}
