import React from "react";
import NavBar from "../Components/NavBar";
// import Form from "../components-inquiry/inquiryForm";
import Footer from "../Components/Footer";

export default function Inquiry() {
  return (
    <div>
      <NavBar />
      <h1>Inquiry Form Page</h1>
      <inquiryForm/>
      <p>
        <br />
      </p>
      <Footer/>
    </div>
  );
}
