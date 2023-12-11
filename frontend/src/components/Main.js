import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../helpers/api";
import { useContext } from "react";
import { EditEmployeeContext } from "../App";
import "../scss/Main.scss";
import "../scss/loader.scss";

const Main = () => {
  const [emoloyees, setEmployees] = useState([]);
  const [error, setError] = useState("The Database is EMPTY");
  const [_, setEditableEmployee] = useContext(EditEmployeeContext);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  // fetch all employees:
  const fetchAllEmployees = async () => {
    try {
      setLoader(true);
      const response = await api.get("/get-employees");
      setEmployees(response.data);
    } catch (err) {
      console.log(err);
      setError(err.response.data.detail);
    } finally {
      setLoader(false);
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
      setLoader(true);
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
    } finally {
      setLoader(false);
    }
  };

  // deleting an individual employee:
  const onDeleteEmployee = async (id, img_url) => {
    try {
      setLoader(true);
      const img_id = img_url.split("/")[4];

      const response = await api.delete(`/delete-employee/${id}`);
      const delete_img = await api.delete(`/delete-image/${img_id}`);

      if (response.status === 200 && delete_img.status === 200) {
        alert(`an Employee with the ID: ${response.data.id}`);
        fetchAllEmployees();
      } else
        throw new Error("Something went wrong while deleting an employee!");
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  // editing an employee info:
  const onEditEmployee = (employee) => {
    setEditableEmployee(employee);
    navigate("/edit");
  };

  return (
    <div className="Main">
      {!loader ? (
        <>
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
                    src={item.image_url}
                    width={300}
                    alt="employee img"
                    className="employee-img"
                  />
                  <p>
                    <strong>Full Name:</strong> {item.first_name}{" "}
                    {item.last_name}
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
                    <strong>Status:</strong>{" "}
                    {item.married ? "Married" : "Single"}
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
                    <button
                      onClick={() => onDeleteEmployee(item.id, item.image_url)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <h2 className="error-msg">{error}</h2>
            )}
          </div>
        </>
      ) : (
        <div className="loader_parent">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default Main;
