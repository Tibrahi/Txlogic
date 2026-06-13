import Link from 'next/link';

/** Wrapper for Next.js Link with proper typing */
export default function NavLink({ href, children, className, style }: { href: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  );
}