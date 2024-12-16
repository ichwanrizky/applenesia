import Script from "next/script";

export default function CpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta content="Service iPhone" name="description" />
        <meta content="MyraStudio" name="author" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        {/* App css */}
        <link
          href="/themes/assets/css/bootstrap.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="/themes/assets/css/icons.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="/themes/assets/css/theme.min.css"
          rel="stylesheet"
          type="text/css"
        />
        {/* Datatables css */}
        <>
          <link
            href="/themes/plugins/datatables/dataTables.bootstrap4.css"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="/themes/plugins/datatables/responsive.bootstrap4.css"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="/themes/plugins/datatables/buttons.bootstrap4.css"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="/themes/plugins/datatables/select.bootstrap4.css"
            rel="stylesheet"
            type="text/css"
          />
        </>
      </head>
      <body>
        {children}

        <div className="menu-overlay"></div>

        <Script src="/themes/assets/js/jquery.min.js"></Script>
        <Script src="/themes/assets/js/bootstrap.bundle.min.js"></Script>
        <Script defer src="/themes/assets/js/metismenu.min.js"></Script>
        <Script defer src="/themes/assets/js/waves.js"></Script>
        <Script defer src="/themes/assets/js/simplebar.min.js"></Script>
        <Script defer src="/themes/assets/js/theme.js"></Script>
      </body>
    </>
  );
}
