// export const config = {
//   matcher: "/:path*"
// };

// export default function middleware() {
//   const html = `
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="robots" content="noindex, nofollow">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>We'll Be Back Soon</title>
//     <style>
//       body {
//         background: #f5f5f5;
//         color: #333;
//         font-family: 'Segoe UI', sans-serif;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         height: 100vh;
//         text-align: center;
//       }
//       .container {
//         max-width: 400px;
//       }
//       h1 {
//         font-size: 2rem;
//       }
//       p {
//         font-size: 1rem;
//       }
//     </style>
//   </head>
//   <body>
//     <div class="container">
//       <h1>We're Under Maintenance</h1>
//       <p>We're improving our site right now.<br> Please check back soon.</p>
//     </div>
//   </body>
//   </html>`;

//   return new Response(html, {
//     status: 503,
//     headers: {
//       "Content-Type": "text/html",
//       "Retry-After": "864000"
//     }
//   });
// }
