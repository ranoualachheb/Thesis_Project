import React from "react";
import "./AddOrDeleteHeads.css";
// import "./CEORouter";
// import { BrowserRouter as  link } from "react-router-dom";
export default class AddHeadDepartment extends React.Component {
  async fillHeadFormOnSubmit(e) {
    e.preventDefault();
    var firstName = document.getElementById("input1").value;
    var lastName = document.getElementById("input2").value;
    var email = document.getElementById("input3").value;
    var position = document.getElementById("selectNewHeadDepartment").value;
    var dateOfBirth = document.getElementById("input4").value;
    var phoneNumber = document.getElementById("input5").value;
    if (
      firstName === "" ||
      firstName === "" ||
      email === "" ||
      position === "" ||
      dateOfBirth === "" ||
      phoneNumber === ""
    ) {
      alert("fill all the form");
      return;
    }
    // console.log(fullName, email, selectNewHeadDepartment, phoneNumber);
    await fetch("http://localhost:5000/CreateNewHeadDepartment", {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        position,
        dateOfBirth,
        phoneNumber,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  render() {
    return (
      <div>
        <form>
          <legend className="section_title">Add a head department</legend>
          <label htmlFor="title">firstName:</label>
          <input
            className="title"
            id="input1"
            type="text"
            name="title"
            placeholder="firstName"
            required
          />
          <label htmlFor="title">lastName:</label>
          <input
            className="title"
            id="input2"
            type="text"
            name="title"
            placeholder="lastName"
            required
          />
          <label htmlFor="title">Email:</label>
          <input
            className="title"
            id="input3"
            type="email"
            placeholder="email"
            required
          />
          <label htmlFor="title">select a department:</label>
          <select
            className="title"
            id="selectNewHeadDepartment"
            type="text"
            required
          >
            <option>head of financial department</option>
            <option>head of accounting department</option>
            <option>head of marketing department</option>
            <option>head of HR department</option>
            <option>head of Methods department</option>
          </select>
          <label htmlFor="title">date of birth:</label>
          <input
            className="title"
            id="input4"
            type="date"
            placeholder="date of birth"
            required
          />
          <label htmlFor="title">Enter a phone number:</label>
          <input
            className="title"
            id="input5"
            placeholder="21-599-654"
            required
          />
          <input
            id="submitNewHeadDepartment"
            type="submit"
            onClick={this.fillHeadFormOnSubmit.bind(this)}
          />
        </form>
        <button id="testButton">
          <link to="/deleteHeadDepartment" />
        </button>
      </div>
    );
  }
}
//.
