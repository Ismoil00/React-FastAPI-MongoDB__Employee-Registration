import React, { useState } from "react";
import EmoloyeeModel from "../helpers/employee-model";
import api from "../helpers/api";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { EditEmployeeContext } from "../App";

const Edit = () => {
  // const [employee, setEmployee] = useState(EmoloyeeModel);
  const [employee, setEmployee] = useContext(EditEmployeeContext);
  const [education, setEducation] = useState("");
  const [invalid, setInvalid] = useState(null);
  const navigate = useNavigate();

  // handle input change:
  const handleChange = (e) => {
    const type = e.target.type;
    const name = e.target.name;
    const value =
      type === "number"
        ? +e.target.value
        : type === "checkbox"
        ? e.target.checked
        : e.target.value;
    const title = e.target.title;

    setEmployee((p) =>
      title === "address"
        ? { ...p, address: { ...p.address, [name]: value } }
        : { ...p, [name]: value }
    );
  };

  // adding educations to employee info:
  const addEducationToEmployeeInfo = () => {
    setEmployee((p) => ({ ...p, education: [...p.education, education] }));
    setEducation("");
  };

  // handling saving employee data:
  const onSaveEmployeeInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(
        `/update-employee/${employee.id}`,
        employee
      );

      if (response.status === 200) {
        setEmployee(EmoloyeeModel);
        alert(response.data.status);
        navigate("/")
      } else throw new Error("Something went wrong!");
    } catch (err) {
      console.log(err);
    }
  };

  // clearing all:
  const onClearAll = () => setEmployee(EmoloyeeModel);

  return (
    <div className="Create">
      <h1>Edit an Employee</h1>
      <button onClick={() => navigate("/")}>Go Back</button>
      <form action="" onSubmit={(e) => onSaveEmployeeInfo(e)}>
        <section>
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            name="first_name"
            required
            value={employee.first_name}
            onChange={(e) => handleChange(e)}
            onInvalid={() => setInvalid("this field must not be empty")}
            placeholder={invalid}
          />
        </section>
        <section>
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            name="last_name"
            required
            value={employee.last_name}
            onChange={(e) => handleChange(e)}
          />
        </section>
        <section>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            name="email"
            required
            value={employee.email}
            onChange={(e) => handleChange(e)}
          />
        </section>
        <section>
          <label htmlFor="profession">Profession:</label>
          <input
            type="text"
            name="profession"
            required
            value={employee.profession}
            onChange={(e) => handleChange(e)}
          />
        </section>
        <section>
          <label htmlFor="salary">Salary:</label>
          <input
            type="number"
            name="salary"
            value={employee.salary}
            onChange={(e) => handleChange(e)}
          />
        </section>
        <section>
          <label htmlFor="age">Age:</label>
          <input
            required
            type="number"
            name="age"
            value={employee.age}
            onChange={(e) => handleChange(e)}
          />
        </section>
        <section>
          <label htmlFor="gender">Gender:</label>
          <select
            name="gender"
            id="gender"
            required
            value={employee.gender}
            onChange={(e) => handleChange(e)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </section>
        <section>
          <label htmlFor="married">Married:</label>
          <input
            type="checkbox"
            name="married"
            checked={employee.married}
            onChange={(e) => handleChange(e)}
          />
        </section>
        <section>
          <label htmlFor="education">
            Educations:{" "}
            {employee.education.map((v, i) => (
              <span key={i}>{v} </span>
            ))}
          </label>
          <div>
            <input
              type="text"
              value={education}
              name="education"
              onChange={(e) => setEducation(e.target.value)}
            />
            <button type="button" onClick={addEducationToEmployeeInfo}>
              +
            </button>
          </div>
        </section>

        {/* ADDRESS SECTION */}
        <h2>Address:</h2>
        <section>
          <label htmlFor="city">City</label>
          <input
            type="text"
            title="address"
            name="city"
            required
            value={employee.address.city}
            onChange={(e) => handleChange(e)}
          />
        </section>
        <section>
          <label htmlFor="street">Street</label>
          <input
            type="text"
            title="address"
            name="street"
            required
            value={employee.address.street}
            onChange={(e) => handleChange(e)}
          />
        </section>
        <section>
          <label htmlFor="building">Building</label>
          <input
            type="text"
            title="address"
            name="building"
            value={employee.address.building}
            onChange={(e) => handleChange(e)}
          />
        </section>
        <section>
          <label htmlFor="home">Home</label>
          <input
            type="text"
            title="address"
            name="home"
            value={employee.address.home}
            onChange={(e) => handleChange(e)}
          />
        </section>
        <section>
          <button type="submit">Save</button>
          <button onClick={onClearAll} type="button">
            Clear
          </button>
        </section>
      </form>
    </div>
  );
};

export default Edit;
