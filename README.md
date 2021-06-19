# To-do list app with React and Firebase
This is a small app that connects to a firebase instance to allow the users to create a todo list with it's correspondant list items.

## Initial configuration

## Pages
The app hast six 'root' pages, that call all the components needed to provide the to-do list functionalities.

### Landing page
It is accesible to all the users, even when they are not logged in, it only displays a text, you could add anything that you want all the people to see in this section.

![landing](https://user-images.githubusercontent.com/37276129/122223287-a7b53480-ce78-11eb-9d4c-c3635d968d8d.PNG)

### Sign In page
This page allows the user to sign in or create a new account. It uses the firebase auth API so aditional sign up methos can be used, such as a Google or Facebook account.

![sign-in](https://user-images.githubusercontent.com/37276129/122400592-7a808900-cf41-11eb-8423-8cfe768be5f6.PNG)

It also has links to a create account page. In this versión of the app the user can choose to be an 'Admin' by activating the checkbox field, you should remove this and add it to another component, e.g. the admin page.

![sign-up](https://user-images.githubusercontent.com/37276129/122564180-ac115700-d00a-11eb-9ae7-b65b1c74e8f7.PNG)

### Home page
The home page is a protected component that is only visible to logged in users, it displays the to-do list and it's items. You can add a new item with the text field at the bottom of the page, and edit or delete an existing one by using the correspondant button.

![home](https://user-images.githubusercontent.com/37276129/122565117-ba13a780-d00b-11eb-8d3b-bc23b81e3827.PNG)

### Account page
Another protected component, it allows the user to reset the password by sending an email with a link or by setting the password manually. This page also lets the user link or unlink other authentication methods.

![account](https://user-images.githubusercontent.com/37276129/122566525-3bb80500-d00d-11eb-9650-18e560bb87a6.PNG)

### Admin page
This page displays all the app users and has a link to a detail component that also allows to send a reset password link.

![admin](https://user-images.githubusercontent.com/37276129/122653913-8e78e600-d10d-11eb-8bc8-5019ebcd3d18.PNG)

![user_detail](https://user-images.githubusercontent.com/37276129/122654023-2545a280-d10e-11eb-8aa2-8980348e199e.PNG)

----------
This project was created with Yarn and Create React App, so I will left the links and notes to the Yarn docs.

----------

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
