export const LANDING = '/';
export const SIGN_UP = '/signup';
export const SIGN_IN = '/signin';
export const HOME = '/home';
export const ACCOUNT = '/account';
export const ADMIN = '/admin';
export const PASSWORD_FORGET = '/pw-forget';
export const ADMIN_DETAILS = '/admin/:id'

/**
 * We use this constants to provide a standarized set of routes for the app
 * if you need to change any route, you only need to change the const value instead of all
 * the files that use the route.
 * 
 * Notice the ADMIN_DETAILS const. It is a child route, the ':id' string is a placeholder for a user id that we will use later.
 * We could have been mor specific and define a route like: '/admin/users/:id', maybe we will manage 
 * other entities in the admin page. e.g., the app will store a set of users and the books written by them, 
 * then it will make sense to have detail pages for users (/admin/users/:userId) and books (/admin/books/:bookId).
 */