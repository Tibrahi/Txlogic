import Link from 'next/link';

// Next.js 9.x Link types don't include children, but React.PropsWithChildren handles it
export default function NavLink({ href, children, className, style }: { href: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    // @ts-ignore - Next.js 9.x Link supports children but the types are incomplete
    <Link href={href}>
      <a className={className} style={style}>{children}</a>
    </Link>
  );
}