Account login : 
    root@gmail.com
    Lasoq112lL_qq
### Core

- React
- React Router
- Redux
- Redux Toolkit
- Reselect
- Redux-Saga
- CSS in JS Emotion
- Typescript
- React-i18next

### UI Template

https://www.minimals.cc/

### Unit Testing

- Jest
- react-testing-library

### Linting

- ESLint
- Prettier
- Stylelint

## Install & Start

⚠️ Using [Yarn Package Manager](https://yarnpkg.com) is recommended over `npm`.

- Install dependencies:

```shell
yarn install
```

- Run application on development

```shell
yarn start
```

- Run application on production

```shell
yarn start:prod
```

- Lint

```shell
yarn lint
# Fix lint
yarn lint:fix
```

- Extracting translation JSON Files

```shell
yarn extract-messages
```

- Generate `component` or `slice`

```shell
yarn generate
```

- Unit Testing

```shell
yarn test
# Run only the Button component tests
yarn test -- Button
```

- Typescript

```shell
yarn checkTs
```

### Trouble shooting

If your pre-commit with husky is ignored, please set as executable with pre-commit file

```shell
chmod +x .husky/pre-commit
```

### Copyright

DISABLE_ESLINT_PLUGIN=true
env-cmd -f .env