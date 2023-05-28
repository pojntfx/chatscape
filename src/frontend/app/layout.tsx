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
        <meta name="description" content="Scalable serverless chat." />
        <meta name="author" content="Felicitas Pojtinger" />
        <meta
          name="keywords"
          content="chat, serverless, aws, lambda, react, hdm-stuttgart"
        />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://github.com/pojntfx/chatscape"
        />
        <meta property="og:title" content="ChatScape" />
        <meta property="og:description" content="Scalable serverless chat." />
        <meta property="og:image" content="/logo-light.png" />

        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="theme-color" content="#212427" />
        <link rel="icon" href="/icon-light-small.png" />
        <link rel="apple-touch-icon" href="/icon-light-small.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body>{children}</body>
    </html>
  );
}
