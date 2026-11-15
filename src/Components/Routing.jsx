import React, { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import RequireAuth from "./RequireAuth";

const Hero = lazy(() => import("./Hero"));
const About = lazy(() => import("./About"));
const Category = lazy(() => import("./Category"));
const Men = lazy(() => import("./Men"));
const Women = lazy(() => import("./Women"));
const Kids = lazy(() => import("./Kids"));
const AdminLogin = lazy(() => import("./Admin/AdminLogin"));
const Register = lazy(() => import("./Register"));
const Profile = lazy(() => import("./Profile"));
const Checkout = lazy(() => import("./Checkout"));
const MyOrders = lazy(() => import("./MyOrders"));
const DashBoard = lazy(() => import("./Admin/DashBoard"));
const Contact = lazy(() => import("./Contact"));
const Cart = lazy(() => import("./Cart"));
const Wishlist = lazy(() => import("./Wishlist"));
const NotFound = lazy(() => import("./NotFound"));
const Welcome = lazy(() => import("./Admin/Welcome"));
const AddProduct = lazy(() => import("./Admin/AddProduct"));
const ViewProducts = lazy(() => import("./Admin/ViewProducts"));
const ViewOrders = lazy(() => import("./Admin/ViewOrders"));
const ViewUsers = lazy(() => import("./Admin/ViewUsers"));
const Employees = lazy(() => import("./Admin/Employees"));
const ViewReviews = lazy(() => import("./Admin/ViewReviews"));
const ViewEnquiries = lazy(() => import("./Admin/ViewEnquiries"));
const ProductDetails = lazy(() => import("./ProductDetails"));

const Routing = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // The dashboard handles its own page transitions.
    const pageKey = pathname.startsWith("/dashboard") ? "dashboard" : pathname;

    return (
        <main className="sf-main">
            <Suspense fallback={<div className="sf-loading"><span className="spinner-border text-success"></span></div>}>
                <div className="sf-page" key={pageKey}>
                    <Routes>
                        <Route path="/" element={<Hero />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/category" element={<Category />} />
                        <Route path="/productdetails/:id" element={<ProductDetails />} />
                        <Route path="/men" element={<Men />} />
                        <Route path="/women" element={<Women />} />
                        <Route path="/kids" element={<Kids />} />
                        <Route path="/login" element={<AdminLogin />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                        <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
                        <Route path="/orders" element={<RequireAuth><MyOrders /></RequireAuth>} />
                        <Route path="/dashboard" element={<RequireAuth staff><DashBoard /></RequireAuth>}>
                            <Route path="" element={<Welcome />} />
                            <Route path="addproduct" element={<RequireAuth page="addproduct"><AddProduct /></RequireAuth>} />
                            <Route path="viewproducts" element={<RequireAuth page="viewproducts"><ViewProducts /></RequireAuth>} />
                            <Route path="vieworders" element={<RequireAuth page="vieworders"><ViewOrders /></RequireAuth>} />
                            <Route path="viewusers" element={<RequireAuth page="viewusers"><ViewUsers /></RequireAuth>} />
                            <Route path="employees" element={<RequireAuth page="employees"><Employees /></RequireAuth>} />
                            <Route path="viewreviews" element={<RequireAuth page="viewreviews"><ViewReviews /></RequireAuth>} />
                            <Route path="viewenquiries" element={<RequireAuth page="viewenquiries"><ViewEnquiries /></RequireAuth>} />
                        </Route>
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </Suspense>
        </main>
    );
};

export default Routing;
