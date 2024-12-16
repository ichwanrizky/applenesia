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
        <meta
          name="description"
          content="Servis iPhone di Applenesia, Pusat Servis Apple terkemuka. Layanan perbaikan tepercaya dan dukungan ahli untuk perangkat Apple."
        />
        <meta name="author" content="Applenesia" />
        <meta
          name="keywords"
          content="Apple service center, iPhone repair, MacBook repair, iWatch service, iPad repair, Apple support, Applenesia, Apple service, Apple care, professional Apple repair, service iPhone, service MacBook, service iWatch, service iPad"
        />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* Open Graph Metadata */}
        <meta property="og:title" content="Applenesia | Apple Service Center" />
        <meta
          property="og:description"
          content="Discover Applenesia, the trusted Apple Service Center for expert repairs and support for all your Apple devices. Visit us today!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.applenesia.com/" />
        <meta
          property="og:image"
          content="https://www.applenesia.com/portal/assets/images_apn/1.png"
        />
        <meta property="og:site_name" content="Applenesia" />

        <title>Applenesia | Apple Service Center</title>
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
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
        <link
          rel="stylesheet"
          href="/portal/assets/css/plugins/animate.min.css"
        />
        <link
          rel="stylesheet"
          href="/portal/assets/css/plugins/swiper-bundle.min.css"
        />
        <link rel="stylesheet" href="/portal/assets/css/style.css" />
      </head>

      <body>
        {children}

        {/* Vendor Scripts */}
        <Script
          src="/portal/assets/js/vendor/modernizr-3.11.2.min.js"
          defer
        ></Script>
        <Script
          src="/portal/assets/js/vendor/jquery-3.6.0.min.js"
          defer
        ></Script>
        <Script
          src="/portal/assets/js/vendor/jquery-migrate-3.3.2.min.js"
          defer
        ></Script>
        <Script
          src="/portal/assets/js/vendor/bootstrap.bundle.min.js"
          defer
        ></Script>
        <Script src="/portal/assets/js/vendor/jquery-ui.min.js" defer></Script>

        {/* Plugin Scripts */}
        <Script
          src="/portal/assets/js/plugins/swiper-bundle.min.js"
          defer
        ></Script>
        <Script
          src="/portal/assets/js/plugins/jquery.waypoints.js"
          defer
        ></Script>
        <Script src="/portal/assets/js/plugins/counter.js" defer></Script>
        <Script
          src="/portal/assets/js/plugins/images-loaded.min.js"
          defer
        ></Script>
        <Script
          src="/portal/assets/js/plugins/isotope.pkgd.min.js"
          defer
        ></Script>
        <Script src="/portal/assets/js/plugins/ajax-mail.js" defer></Script>
        <Script
          src="/portal/assets/js/plugins/material-scrolltop.js"
          defer
        ></Script>

        {/* Main JS */}
        <Script src="/portal/assets/js/main.js" defer></Script>

        {/* Debugging Script */}
        <Script id="debug-scripts" defer>
          {`
            document.addEventListener('DOMContentLoaded', function () {
              console.log('jQuery loaded:', typeof jQuery !== 'undefined');
              console.log('CounterUp loaded:', typeof $.fn.counterUp === 'function');
              console.log('Isotope loaded:', typeof $.fn.isotope === 'function');
            });
          `}
        </Script>

        {/* Initialize Plugins */}
        <Script id="initialize-plugins" defer>
          {`
            document.addEventListener('DOMContentLoaded', function () {
              const $ = jQuery;

                if (typeof $.fn.materialScrollTop === 'function') {
                $('body').materialScrollTop();
              } else {
                console.error('MaterialScrollTop plugin is not loaded or initialized correctly.');
              }

              // Initialize CounterUp
              if ($('.counter').length && typeof $.fn.counterUp === 'function') {
                $('.counter').counterUp({ delay: 10, time: 1000 });
              } else {
                console.error('CounterUp plugin is not loaded or initialized correctly.');
              }
                

              // Initialize Isotope
              if ($('.project-items').length && typeof $.fn.isotope === 'function') {
                const $grid = $('.project-items').isotope({
                  itemSelector: '.filter-item',
                  layoutMode: 'fitRows',
                });

                // Bind filter buttons
                $('.projects-gallery-filter-nav').on('click', 'button', function () {
                  const filterValue = $(this).attr('data-filter');
                  $grid.isotope({ filter: filterValue });

                  $(this).siblings('.active').removeClass('active');
                  $(this).addClass('active');
                });
              } else {
                console.error('Isotope plugin is not loaded or initialized correctly.');
              }
            });
          `}
        </Script>
      </body>
    </>
  );
}
