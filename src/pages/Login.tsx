import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../store/themeConfigSlice';
import Dropdown from '../components/Dropdown';
import { IRootState } from '../store';
import i18next from 'i18next';
import IconCaretDown from '../components/Icon/IconCaretDown';
import IconMail from '../components/Icon/IconMail';
import IconLockDots from '../components/Icon/IconLockDots';
import IconInstagram from '../components/Icon/IconInstagram';
import IconFacebookCircle from '../components/Icon/IconFacebookCircle';
import IconTwitter from '../components/Icon/IconTwitter';
import IconGoogle from '../components/Icon/IconGoogle';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { isEmpty } from '../utils/utils';
// import { toast } from "react-toastify";
// import { isEmpty } from "../utils/isAuthData";
// const isEmpty = () => { return true }
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string().required("Password is required"),

});


const Login = () => {
    const [Loading, setLoading] = useState(false);
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setLoading(true);

            console.log("hihih");
            console.log(Loading);

            var response = null
            console.log(values);
            if (values.email === "admin@gmail.com" && values.password === "123456") {
                response = [{
                    _id: "1234",
                    email: "admin@gmail.com"
                }]
            }
            try {
                if (response) {
                    toast.success("Login successfully");
                    // navigate('/');
                    localStorage.setItem('userData', JSON.stringify(response));
                    window.location.href = '/dashboard';

                } else {

                    toast.error("email or password incorrect");
                }
                console.log(response);

            } catch (error) {
                // Handle error
                console.error("Error submitting data:", error);

                // Display error message (you can use a toast library or another UI element)
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        },
    });
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Login Cover'));
    });
    const navigate = useNavigate();
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);

    const submitFormSucess = () => {
        navigate('/');
    };

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">

                            <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                                <img src="/assets/images/auth/login.svg" alt="Cover Image" className="w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">

                        <div className="w-full max-w-[440px] lg:mt-16">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign in</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your email and password to login</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={formik.handleSubmit}>
                                <div>
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            name="email"
                                            id="Email" type="email" placeholder="Enter Email"
                                            className="form-input ps-10 placeholder:text-white-dark" />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                    {formik.touched.email && formik.errors.email && (
                                        <div className="text-red-500 text-sm text-start ps-2">
                                            {formik.errors.email}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            id="Password"
                                            name="password"
                                            type="password" placeholder="Enter Password" className="form-input ps-10 placeholder:text-white-dark" />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                    {formik.touched.password && formik.errors.password && (
                                        <div className="text-red-500 text-sm text-start ps-2">
                                            {formik.errors.password}
                                        </div>
                                    )}
                                </div>
                                {/* <div>
                                    <label className="flex cursor-pointer items-center">
                                        <input type="checkbox" className="form-checkbox bg-white dark:bg-black" />
                                        <span className="text-white-dark">Subscribe to weekly newsletter</span>
                                    </label>
                                </div> */}

                                <button disabled={Loading} type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    {Loading ? "Loading ..." : "Sign In"}
                                </button>
                            </form>



                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
