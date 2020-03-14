module.exports = (formData, title) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <script src="https://kit.fontawesome.com/6090e91e37.js" crossorigin="anonymous"></script>
      <link href="/css/main.css" rel="stylesheet">
    </head>

    
    <body>
    <h2 class="title">${title}</h2>
    <div class="container">
            ${formData}
        </div>
    </body>
    
    </html>`;
};