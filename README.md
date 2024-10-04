# Lejing Dashboard Pro

The admin-dashboard for [lejing-mall](https://github.com/Weasley-J/lejing-mall), require node v20.x.x or later.

![登陆](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/login_20241004040311.png)
![首页](https://weasley.oss-cn-shanghai.aliyuncs.com/Photos/home_20241004040222.png)

# Tech Stack Links

- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/reference/react/useActionState)
- [React-router-dom](https://v5.reactrouter.com/web/guides/quick-start)
- [Ant Design](https://ant.design/docs/react/introduce)
- [Axios](https://axios-http.com/docs/intro)
- [Resso](https://github.com/nanxiaobei/resso)
- [Iconfont](https://www.iconfont.cn/)

# Getting Started

React + TypeScript + Vite: This template provides a minimal setup to get React working in Vite with HMR and some ESLint
rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)
  uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast
  Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```javascript
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname
    }
  }
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or
  `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```javascript
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules
  }
})
```
