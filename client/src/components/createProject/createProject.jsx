import React, { Component } from "react";
import "./createProject.css";
import axios from "axios";

class CreateProject extends Component {
  state = { title: "", description: "", deadline: "" };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState(
      {
        title: this.title.value,
        description: this.description.value,
        deadline: this.deadline.value,
//}
      },
      () => {
        axios
          .post("http://localhost:5000/project/create", this.state)
          .then((response) => {
            console.log(response.data);
          })

          .catch((err) => console.log("Error", err));
      }
    );
  };

  render() {
    const { title, description, date } = this.state;
    return (
      <div className="main">
        <p className="sign" align="center">
          Sign in
        </p>
        <form className="form1">
          <input
            className="un"
            type="text"
            align="center"
            placeholder="Username"
          />
          <input
            className="pass"
            type="password"
            align="center"
            placeholder="Password"
          />
          <a className="submit" align="center">
            Sign in
          </a>
        </form>
      </div>
    );
  }
}

export default CreateProject;
