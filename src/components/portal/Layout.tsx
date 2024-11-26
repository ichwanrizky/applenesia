import Script from "next/script";

export default function PortalLayout({
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
        {/* App favicon */}
        <link rel="shortcut icon" href="/themes/assets/images/favicon.ico" />
        {/* App css */}
        <>
          {/* Vendor CSS */}
          <link
            rel="stylesheet"
            href="/portal/assets/css/vendor/bootstrap.min.css"
          />
          <link
            rel="stylesheet"
            href="/portal/assets/css/vendor/icofont.min.css"
          />
          <link
            rel="stylesheet"
            href="/portal/assets/css/vendor/jquery-ui.min.css"
          />
          {/* Plugin CSS */}
          <link
            rel="stylesheet"
            href="/portal/assets/css/plugins/animate.min.css"
          />
          <link
            rel="stylesheet"
            href="/portal/assets/css/plugins/swiper-bundle.min.css"
          />
          {/* Style CSS */}
          <link rel="stylesheet" href="/portal/assets/css/style.css" />
        </>
      </head>

      <body>
        {children}
        <Script src="/portal/assets/js/vendor/modernizr-3.11.2.min.js"></Script>
        <Script src="/portal/assets/js/vendor/jquery-3.6.0.min.js"></Script>
        <Script src="/portal/assets/js/vendor/jquery-migrate-3.3.2.min.js"></Script>
        <Script src="/portal/assets/js/vendor/bootstrap.bundle.min.js"></Script>
        <Script src="/portal/assets/js/vendor/jquery-ui.min.js"></Script>

        <Script src="/portal/assets/js/plugins/swiper-bundle.min.js"></Script>
        <Script src="/portal/assets/js/plugins/jquery.waypoints.js"></Script>
        <Script src="/portal/assets/js/plugins/counter.js"></Script>
        <Script src="/portal/assets/js/plugins/images-loaded.min.js"></Script>
        <Script src="/portal/assets/js/plugins/isotope.pkgd.min.js"></Script>
        <Script src="/portal/assets/js/plugins/ajax-mail.js"></Script>
        <Script src="/portal/assets/js/plugins/material-scrolltop.js"></Script>

        <Script src="/portal/assets/js/main.js"></Script>
      </body>
    </>
  );
}
