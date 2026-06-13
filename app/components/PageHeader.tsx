import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  breadcrumbs?: { label: string; href?: string; accent?: string }[];
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 animate-slide-up">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 mb-2">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-xs text-gray-600">/</span>}
              {crumb.href ? (
                <Link href={crumb.href}>
                  <a className={`text-xs text-gray-500 hover:text-cyan-400 transition-colors`}>
                    {crumb.label}
                  </a>
                </Link>
              ) : (
                <span className="text-xs text-gray-300">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            <span className="gradient-text">{title}</span>
          </h1>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
        {actions && <div className="flex items-center gap-4">{actions}</div>}
      </div>
    </div>
  );
}