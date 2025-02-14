# Contributing

## Requirements

- Node.js and npm

### Optional

- [nvm](https://github.com/nvm-sh/nvm)
- [volta](https://volta.sh/)

## Getting started

Run the following command on your local environment:

``` bash
git clone --depth=1 https://github.com/mdzhang/amen-add-quiz
cd amen-add-quiz
npm install
```

Then, you can run locally in development mode with live reload:

``` bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) with your favorite browser
to see your project.

## Deploy to production (manual)

You can create an optimized production build with:

```shell
npm run build
```

Now, your blog is ready to be deployed. All generated files are located at
`dist` folder, which you can deploy the folder to any hosting service you
prefer.

## Deploy

This site is deployed automatically using Github Pages on merge to `main`.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                       |
|:----------------  |:-------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:4321`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |
| `npm run clean`   | Remove `./dist` folder                       |
| `npm run lint`    | Run ESLint and report styling error          |

## Test

Use `http://localhost:4321/amen-adhd-quiz/quiz/72/?answers=%2C0%3D1%2C0%3D0%2C0%3D3%2C1%3D3%2C2%3D3%2C3%3D3%2C4%3D3%2C5%3D3%2C6%3D3%2C7%3D3%2C8%3D3%2C9%3D3%2C10%3D2%2C11%3D1%2C12%3D3%2C13%3D2%2C14%3D3%2C15%3D1%2C16%3D1%2C17%3D2%2C18%3D1%2C19%3D1%2C20%3D0%2C21%3D2%2C22%3D3%2C23%3D2%2C24%3D3%2C25%3D0%2C26%3D2%2C27%3D2%2C28%3D1%2C29%3D3%2C30%3D3%2C31%3D3%2C32%3D2%2C33%3D3%2C34%3D3%2C35%3D3%2C36%3D3%2C37%3D3%2C38%3D3%2C39%3D2%2C40%3D3%2C41%3D1%2C42%3D1%2C43%3D0%2C44%3D2%2C45%3D3%2C46%3D1%2C47%3D1%2C48%3D3%2C49%3D2%2C50%3D3%2C51%3D3%2C52%3D2%2C53%3D2%2C54%3D3%2C55%3D0%2C56%3D4%2C57%3D1%2C58%3D0%2C59%3D1%2C60%3D3%2C61%3D2%2C62%3D3%2C63%3D2%2C64%3D1%2C65%3D1%2C66%3D1%2C67%3D1%2C68%3D0%2C69%3D0%2C70%3D0` as a url
