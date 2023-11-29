import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../helpers/api";
import { useContext } from "react";
import { EditEmployeeContext } from "../App";
import "../scss/Main.scss";

const Main = () => {
  const [emoloyees, setEmployees] = useState([]);
  const [error, setError] = useState("The Database is EMPTY");
  const [_, setEditableEmployee] = useContext(EditEmployeeContext);
  const navigate = useNavigate();

  // fetch all employees:
  const fetchAllEmployees = async () => {
    try {
      const response = await api.get("/get-employees");
      setEmployees(response.data);
    } catch (err) {
      console.log(err);
      setError(err.response.data.detail);
    }
  };

  // on initial load:
  useEffect(() => {
    fetchAllEmployees();
  }, []);

  // creating new employee:
  const onCreateEmployee = () => navigate("/create");

  // deleting all employees:
  const onDeleteAll = async () => {
    try {
      const response = await api.delete("/delete-all-employees");

      if (response.status === 200) {
        alert(response.details);
        fetchAllEmployees();
      } else
        throw new Error(
          "Something went wrong while trying to delete all the records!"
        );
    } catch (err) {
      console.log(err);
    }
  };

  // deleting an individual employee:
  const onDeleteEmployee = async (id) => {
    try {
      const response = await api.delete(`/delete-employee/${id}`);

      if (response.status === 200) {
        alert(`an Employee with the ID: ${response.data.id}`);
        fetchAllEmployees();
      } else throw new Error("Something went wrong!");
    } catch (err) {
      console.log(err);
    }
  };

  // editing an employee info:
  const onEditEmployee = (employee) => {
    setEditableEmployee(employee);
    navigate("/edit");
  };

  return (
    <div className="Main">
      <h1>The List of Employees</h1>
      <div className="main-btns">
        <button onClick={onCreateEmployee} className="main-create-employee">
          Create new Employee
        </button>
        <button onClick={onDeleteAll} className="delete-all-employees">
          Delete all Employees
        </button>
      </div>
      <div className="articles">
        {emoloyees.length ? (
          emoloyees.map((item) => (
            <article key={item.id} className="article">
              <img
                src="images/face.png"
                width={300}
                alt="employee img"
                className="employee-img"
              />
              <p>
                <strong>Full Name:</strong> {item.first_name} {item.last_name}
              </p>
              <p>
                <strong>Email:</strong> {item.email}
              </p>
              <p>
                <strong>Profession:</strong> {item.profession}
              </p>
              <p>
                <strong>Salary:</strong> {item.salary}
              </p>
              <p>
                <strong>Age:</strong> {item.age}
              </p>
              <p>
                <strong>Gender:</strong> {item.gender}
              </p>
              <p>
                <strong>Status:</strong> {item.married ? "Married" : "Single"}
                <span></span>
              </p>
              <p>
                <strong>Educations:</strong>{" "}
                {item.education.map((v, i) => (
                  <span key={i}>{v}, </span>
                ))}
              </p>
              <p>
                <strong>Address: </strong>
                {item.address.city +
                  ", " +
                  item.address.street +
                  "," +
                  item.address.building +
                  "/" +
                  item.address.home}
              </p>
              <div className="article-btns">
                <button onClick={() => onEditEmployee(item)}>Edit</button>
                <button onClick={() => onDeleteEmployee(item.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))
        ) : (
          <h2 className="error-msg">{error}</h2>
        )}
      </div>
    </div>
  );
};

export default Main;
