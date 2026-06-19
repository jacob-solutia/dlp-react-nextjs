// Layout for the (auth) route group. The parentheses keep the folder out of the
// URL (/login stays /login) while letting these pages share a layout.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-muted flex min-h-svh flex-1 flex-col items-center justify-center px-6 py-16">
      {children}
    </main>
  );
}
