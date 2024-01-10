import "./App.css";
import Navbar from "./Common/Navbar/Navbar";
import Home from "./Components/pages/Home";
import About from "./Components/About/About";
import Gallery from "./Components/gallery/Gallery";
import Favourite from "./Components/favourite/Gallery";
//import Destinations from "./Components/Destinations/Destinations"
//import DHome from "./Components/Destinations/Home"
import React, { Component } from "react";
import Destinations from "./Components/Destinations/Home";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SinglePage from "./SinglePage/SinglePage";

/*-------------blog------------ */
import Blog from "./Components/Blog/Blog";
import BlogSingle from "./Components/Blog/blog-single-page/BlogSingle";
import Testimonial from "./Components/Testimonial/Testimonial";
import Contact from "./Components/Contact/Contact";
import Footer from "./Common/footer/Footer";
import Login from "./Components/login/Login";
import Register from "./Components/login/Register";
import Profile from "./Components/login/Profile";
import Change from "./Components/login/Change";
import Detail from "./Components/detail/detail";
import Booking from "./Components/Booking/booking";
import Preview from "./Components/Preview/preview";
import Cart from "./Components/pages/Cart";
import Book from "./Components/pages/Book";
/*-------------blog------------ */

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" exact component={About} />
          <Route path="/gallery" exact component={Gallery} />
          <Route path="/favourite" exact component={Favourite} />
          <Route path="/destinations" exact component={Destinations} />
          <Route path="/singlepage/:id" component={SinglePage} />
          <Route path="/blog" exact component={Blog} />
          <Route path="/blogsingle/:id" component={BlogSingle} />
          <Route path="/testimonial" component={Testimonial} />
          <Route path="/contact" component={Contact} />
          <Route path="/sign-in" component={Login} />
          <Route path="/Register" component={Register} />
          <Route path="/Profile" component={Profile} />
          <Route path="/change" component={Change} />
          <Route path="/cart" component={Cart} />
          <Route path="/book" component={Book} />
          <Route path="/detail/:id" component={Detail} />
          <Route path="/booking/:id" component={Booking} />
          <Route path="/preview/:id" component={Preview} />
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
