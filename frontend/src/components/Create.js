import React, { useState } from "react";
import EmoloyeeModel from "../helpers/employee-model";
import api from "../helpers/api";
import { useNavigate } from "react-router-dom";
import "../scss/Create.scss";

// image format conversion:
const convertImageToBase64 = (img) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);

  const data = new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });

  return data;
};

const Create = () => {
  const [employee, setEmployee] = useState(EmoloyeeModel);
  const [education, setEducation] = useState("");
  const [img, setImg] = useState("");
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

  // handle file change:
  const handleChangeFile = async (e) => {
    const file = e.target.files[0];
    const image = await convertImageToBase64(file);
    console.log(image)
    // setImg(image);
  };

  // console.log(img);

  // adding educations to employee info:
  const addEducationToEmployeeInfo = () => {
    setEmployee((p) => ({ ...p, education: [...p.education, education] }));
    setEducation("");
  };

  // handling saving employee data:
  const onSaveEmployeeInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/create-employee", employee);
      // const image = await api.post("/save-image", { image: img });
      // console.log(image)
      if (response.status === 200) {
        setEmployee(EmoloyeeModel);
        alert(response.data.status);
      } else throw new Error("Something went wrong!");
    } catch (err) {
      console.log(err);
    }
  };

  // clearing all:
  const onClearAll = () => setEmployee(EmoloyeeModel);

  return (
    <div className="Create">
      <h1>Create an Employee</h1>
      <button className="go-back-btn" onClick={() => navigate("/")}>
        Go Back
      </button>
      <form className="Create-Form" onSubmit={(e) => onSaveEmployeeInfo(e)}>
        <section>
          <label htmlFor="image-upload">
            <img
              src="images/face-icon.png"
              alt="employee img"
              className="image-upload"
            />
          </label>
          <input
            type="file"
            name="image-upload"
            id="image-upload"
            style={{ display: "none" }}
            onChange={handleChangeFile}
          />
        </section>
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
            className="gender-dropdown"
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
        <section className="checkbox">
          <label htmlFor="married">Married:</label>
          <input
            type="checkbox"
            name="married"
            checked={employee.married}
            onChange={(e) => handleChange(e)}
          />
        </section>
        <section>
          <label htmlFor="education" className="education-section-label">
            Educations:{" "}
            {employee.education.map((v, i) => (
              <span key={i}>{v} </span>
            ))}
          </label>
          <div className="education-section">
            <input
              type="text"
              value={education}
              name="education"
              onChange={(e) => setEducation(e.target.value)}
            />
            <button
              className="add-btn"
              type="button"
              onClick={addEducationToEmployeeInfo}
            >
              +
            </button>
          </div>
        </section>

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
        <div className="btns">
          <button type="submit">Save</button>
          <button onClick={onClearAll} type="button">
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;
