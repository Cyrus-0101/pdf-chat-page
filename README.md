# pdf-chat-page

To run the app use bun

```sh
    cd pdf-chat-page
    bun i

    bun run dev
```

TO check the desired link open the browswer and write

```javascript
    'http://localhost:5174/doc_chat?link=https://community.alteryx.com/pvsmt99345/attachments/pvsmt99345/product-ideas/1376/1/s3.docx' # For docx pages to render

    'http://localhost:5174/doc_chat?link=https://docs.aws.amazon.com/pdfs/AmazonS3/latest/userguide/s3-userguide.pdf' # For PDF to render

```

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
bun install
```

### Compile and Hot-Reload for Development

```sh
bun dev
```

### Compile and Minify for Production

```sh
bun build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
bun test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
bun lint
```
