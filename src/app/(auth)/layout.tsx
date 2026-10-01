export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <nav className="border-b px-6 py-4">Auth Navigation</nav>

      <main>{children}</main>
    </div>
  );
}
