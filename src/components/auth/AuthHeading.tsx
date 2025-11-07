interface AuthHeadingProps {
  title: string;
  subtitle?: string;
}

export const AuthHeading = ({ title, subtitle }: AuthHeadingProps) => (
  <header className="mb-6">
    <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
  </header>
);
