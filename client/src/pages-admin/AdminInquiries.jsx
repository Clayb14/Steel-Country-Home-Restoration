import React from "react";
import NavBarAdmin from "../Components/NavBar-Admin"; //Hala
import InquiryTable from "../components-inquiry/inquiryTable";
import Footer from "../Components/Footer";

export default function AdminInquiries() {
  return (
    <div>
      <NavBarAdmin />
      <h1>Admin Inquiries Page</h1>
     <InquiryTable/>
      <Footer />
    </div>
  );
}
