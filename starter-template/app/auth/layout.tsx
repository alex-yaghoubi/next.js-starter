export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Nested App Router layouts must not render additional document roots.
  return <section className="min-h-screen">{children}</section>;
}
