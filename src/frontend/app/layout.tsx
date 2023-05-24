import "./globals.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>ChatScape</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="description" content="Scalable Serverless Chat" />
        <link rel="icon" href="/icon-light.png" />
      </head>

      <body>{children}</body>
    </html>
  );
}
