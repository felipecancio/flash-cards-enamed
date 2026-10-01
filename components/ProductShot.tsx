import Image from "next/image";

export function ProductShot({
  priority = false,
  className = "",
}: {
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src="/mockup-principal.png"
      alt="200 Casos Clínicos Resolvidos para o Enamed: o livro, o caso no celular e a resolução comentada no tablet."
      width={1024}
      height={682}
      priority={priority}
      className={`h-auto w-full [filter:drop-shadow(0_16px_24px_rgba(8,22,38,0.16))] ${className}`}
    />
  );
}
