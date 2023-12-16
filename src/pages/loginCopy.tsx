import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
// import { toast } from "react-toastify";
import { isEmpty } from "../utils/isAuthData";

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string().required("Password is required"),

});

const ContactPage = () => {

    const [Loading, setLoading] = useState(false);
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setLoading(true);
            var response = null
            console.log(values);
            if (values.email === "admin@gmail.com" && values.password === "123456") {
                response = [{
                    _id: "1234",
                    email: "admin@gmail.com"
                }]
            }
            try {
                // Perform the API request (replace the URL with your actual API endpoint)
                // const response = await axios.post(
                //   "http://localhost:3000/api/member/login",
                //   values
                // );
                if (response) {
                    alert("okoko")
                }else{
                    alert("badd")
                }


                console.log(response);

                // Handle success
                // if (!isEmpty(response.data.result)) {
                //  alert("okok add routing")
                //   localStorage.setItem('userData', JSON.stringify(response.data.result));
                //   window.location.href='/info';
                //   resetForm();
                // } else {
                //     alert("fails add routing")
                // }
            } catch (error) {
                // Handle error
                console.error("Error submitting data:", error);

                // Display error message (you can use a toast library or another UI element)
            } finally {
                setLoading(false);
            }
        },
    });
    return (
        <div className="w-full bg-white border rounded-xl ">
            <div className="text-center py-20 responsive">
                <h1 className="text-2xl font-bold text-slate-800 uppercase">LOGIN</h1>

                <div className="w-full h-full p-5 rounded">
                    <form onSubmit={formik.handleSubmit}>
                        <div
                            className="flex flex-col justify-between h-full text-slate-500"
                            style={{ maxWidth: "400px", margin: "0 auto" }}
                        >
                            <div className="mt-5 space-y-2">
                                <input
                                    type="text"
                                    placeholder="Email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`bg-[#ebedeb] w-full text-sm py-3 px-3 rounded ${formik.touched.email && formik.errors.email && "border-red"
                                        }`}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <div className="text-red-500 text-sm text-start ps-2">
                                        {formik.errors.email}
                                    </div>
                                )}

                                <input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={`bg-[#ebedeb] w-full text-sm py-3 px-3 rounded ${formik.touched.password &&
                                        formik.errors.password &&
                                        "border-red"
                                        }`}
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <div className="text-red-500 text-sm text-start ps-2">
                                        {formik.errors.password}
                                    </div>
                                )}


                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 mt-10 text-white bg-blue-900 rounded-md "
                                disabled={Loading}
                            >
                                {Loading ? "Loading ..." : "Sign In"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="py-3 text-sm">
                    <div
                        id="comments-description"
                        className="text-[#7E7A7C]"
                    >
                        Register for membership?
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;




============

import { createBrowserRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { routes, publicRoute } from './routes';
import { isAuthData } from '../utils/isAuthData';
const publicRoute = [{
    path: '/',
    element: <Login />,
    layout: '',
}, {
    path: '*',
    element: <Login />,
    layout: 'blank',
},]
const finalRoutes = isAuthData() ? routes.map((route) => {
    return {
        ...route,
        element: route.layout === 'blank' ? <BlankLayout>{route.element}</BlankLayout> : <DefaultLayout>{route.element}</DefaultLayout>,
    };
}) : publicRoute.map((route) => {
    return {
        ...route,
        element: route.layout === 'blank' ? <BlankLayout>{route.element}</BlankLayout> : <DefaultLayout>{route.element}</DefaultLayout>,
    };
});

const router = createBrowserRouter(finalRoutes);

export default router;
