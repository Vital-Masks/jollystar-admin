import { createBrowserRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { routes, publicRoute } from './routes';
import { isAuthData } from '../utils/utils';

const finalRoutes = isAuthData() ? (routes.map((route) => {
    console.log("=====")
    console.log(route)
    return {
        ...route,
        element: route.layout === 'blank' ?
            <BlankLayout>{route.element}</BlankLayout>
            : <DefaultLayout>{route.element}</DefaultLayout>,
    };
})) : (publicRoute.map((route) => {
    console.log("okokokok")
    console.log(route)
    return {
        ...route,
        element: route.layout === 'blank' ? <BlankLayout>{route.element}</BlankLayout> : <DefaultLayout>{route.element}</DefaultLayout>,
    };
}));


const router = createBrowserRouter(finalRoutes);

export default router;
