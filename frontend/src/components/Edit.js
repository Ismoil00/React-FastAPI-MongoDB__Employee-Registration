import React, { useState } from "react";
import EmoloyeeModel from "../helpers/employee-model";
import api from "../helpers/api";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { EditEmployeeContext } from "../App";
import "../scss/Edit.scss";

const Edit = () => {
  // const [employee, setEmployee] = useState(EmoloyeeModel);
  const [employee, setEmployee] = useContext(EditEmployeeContext);
  const [education, setEducation] = useState("");
  const [img, setImg] = useState(null);
  const [imageUrl, setImageUrl] = useState(employee.image_url);
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
  const handleFileChange = (event) => {
    const selectedImg = event.target.files[0];
    setImg(selectedImg);

    // to display it on the frontend:
    if (selectedImg) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageUrl(reader.result);
      };

      reader.readAsDataURL(selectedImg);
    }
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
      let delete_img;
      if (employee.image_url !== imageUrl) {
        // we save an employee image:
        const formData = new FormData();
        formData.append("image", img);

        const image = await api.post("/save-image", formData);

        if (image.status !== 200)
          throw new Error("Something went wrong while saving image!");

        // we delete a previously image if another image was chosen:
        const id = employee.image_url.split("/")[4];
        delete_img = await api.delete(`/delete-image/${id}`);

        if (delete_img.status !== 200)
          throw new Error(
            "Something went wrong while deleting previous image!"
          );

        employee.image_url = `http://localhost:8000/get-image/${image.data.id}`;
      }

      // we save the whole employee data
      const response = await api.put(
        `/update-employee/${employee.id}`,
        employee
      );

      if (response.status === 200) {
        setEmployee(EmoloyeeModel);
        setImageUrl("images/face-icon.png");
        setImg(null);
        alert(response.data.status);
        navigate("/");
      } else throw new Error("Something went wrong!");
    } catch (err) {
      console.log(err);
    }
  };

  // clearing all:
  const onClearAll = () => {
    setImageUrl("images/face-icon.png");
    setEmployee(EmoloyeeModel);
  };

  return (
    <div className="Edit">
      <h1>Edit an Employee</h1>
      <button className="go-back-btn" onClick={() => navigate("/")}>
        Go Back
      </button>
      <form className="Edit-Form" onSubmit={(e) => onSaveEmployeeInfo(e)}>
        <section>
          <label htmlFor="image-upload">
            <img src={imageUrl} alt="employee img" className="image-upload" />
          </label>
          <input
            type="file"
            name="image-upload"
            id="image-upload"
            style={{ display: "none" }}
            onChange={handleFileChange}
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

export default Edit;
