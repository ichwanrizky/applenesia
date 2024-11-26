export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // return (
  //   <html lang="en">
  //     <head>
  //       <meta charSet="utf-8" />
  //       <meta
  //         name="viewport"
  //         content="width=device-width, initial-scale=1, shrink-to-fit=no"
  //       />
  //       <meta content="Service iPhone" name="description" />
  //       <meta content="MyraStudio" name="author" />
  //       <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
  //       {/* App favicon */}
  //       <link rel="shortcut icon" href="/themes/assets/images/favicon.ico" />
  //       {/* App css */}
  //       <link
  //         href="/themes/assets/css/bootstrap.min.css"
  //         rel="stylesheet"
  //         type="text/css"
  //       />
  //       <link
  //         href="/themes/assets/css/icons.min.css"
  //         rel="stylesheet"
  //         type="text/css"
  //       />
  //       <link
  //         href="/themes/assets/css/theme.min.css"
  //         rel="stylesheet"
  //         type="text/css"
  //       />
  //       {/* Datatables css */}
  //       <>
  //         <link
  //           href="/themes/plugins/datatables/dataTables.bootstrap4.css"
  //           rel="stylesheet"
  //           type="text/css"
  //         />
  //         <link
  //           href="/themes/plugins/datatables/responsive.bootstrap4.css"
  //           rel="stylesheet"
  //           type="text/css"
  //         />
  //         <link
  //           href="/themes/plugins/datatables/buttons.bootstrap4.css"
  //           rel="stylesheet"
  //           type="text/css"
  //         />
  //         <link
  //           href="/themes/plugins/datatables/select.bootstrap4.css"
  //           rel="stylesheet"
  //           type="text/css"
  //         />
  //       </>
  //     </head>
  //     <body>
  //       {children}
  //       <div className="menu-overlay"></div>

  //       <Script src="/themes/assets/js/jquery.min.js"></Script>
  //       <Script src="/themes/assets/js/bootstrap.bundle.min.js"></Script>
  //       <Script src="/themes/assets/js/metismenu.min.js"></Script>
  //       <Script src="/themes/assets/js/waves.js"></Script>
  //       <Script src="/themes/assets/js/simplebar.min.js"></Script>
  //       <Script src="/themes/assets/js/theme.js"></Script>

  //       {/* Datatables */}
  //       <Script src="/themes/plugins/datatables/jquery.dataTables.min.js"></Script>
  //       <Script src="/themes/plugins/datatables/dataTables.bootstrap4.js"></Script>
  //       <Script src="/themes/plugins/datatables/dataTables.responsive.min.js"></Script>
  //       <Script src="/themes/plugins/datatables/responsive.bootstrap4.min.js"></Script>
  //       <Script src="/themes/plugins/datatables/dataTables.buttons.min.js"></Script>
  //       <Script src="/themes/plugins/datatables/buttons.bootstrap4.min.js"></Script>
  //       <Script src="/themes/plugins/datatables/buttons.html5.min.js"></Script>
  //       <Script src="/themes/plugins/datatables/buttons.flash.min.js"></Script>
  //       <Script src="/themes/plugins/datatables/buttons.print.min.js"></Script>
  //       <Script src="/themes/plugins/datatables/dataTables.keyTable.min.js"></Script>
  //       <Script src="/themes/plugins/datatables/dataTables.select.min.js"></Script>
  //       <Script src="/themes/plugins/datatables/pdfmake.min.js"></Script>
  //       <Script src="/themes/plugins/datatables/vfs_fonts.js"></Script>
  //       <Script src="/themes/assets/pages/datatables-demo.js"></Script>
  //     </body>
  //   </html>
  // );

  return <html lang="en">{children}</html>;
}
