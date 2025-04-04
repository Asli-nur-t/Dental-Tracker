export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-light-blue">
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
          {children}
        </main>
      </body>
    </html>
  );
} 