import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./OnboardingDogs.scss";

function Onboarding() {
  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    owner_name: "",
    dob_day: "",
    dob_month: "",
    dob_year: "",
    show_gender: false,
    gender: "male",
    url_1: "",
    about_me: "",
    matches: [],
  });

  const handleSubmit = () => {
    console.log("submitted");
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;

    // update formData with user input
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <Navbar minimal={true} setShowModal={() => {}} showModal={false} />
      <div className="onboarding">
        <h2>CREATE YOUR DOG'S PROFILE</h2>

        <form onSubmit={handleSubmit}>
          <section>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="name"
              required={true}
              value={formData.name}
              onChange={handleChange}
            />

            <label>Birthday</label>
            <div className="multiple-input-container">
              <input
                id="dob_day"
                type="number"
                name="dob_day"
                placeholder="DD"
                required={true}
                value={formData.dob_day}
                onChange={handleChange}
              />
              <input
                id="dob_month"
                type="number"
                name="dob_month"
                placeholder="MM"
                required={true}
                value={formData.dob_month}
                onChange={handleChange}
              />
              <input
                id="dob_year"
                type="number"
                name="dob_year"
                placeholder="YYYY"
                required={true}
                value={formData.dob_year}
                onChange={handleChange}
              />
            </div>

            <label>Gender</label>
            <div className="multiple-input-container">
              <input
                id="male-gender-identity"
                type="radio"
                name="gender"
                value={"male"}
                onChange={handleChange}
                checked={formData.gender === "male"}
              />
              <label htmlFor="male-gender-identity">Male</label>
              <input
                id="female-gender-identity"
                type="radio"
                name="gender"
                value={"female"}
                onChange={handleChange}
                checked={formData.gender === "female"}
              />
              <label htmlFor="female-gender-identity">Female</label>
              <input
                id="other-gender-identity"
                type="radio"
                name="gender"
                value={"other"}
                onChange={handleChange}
                checked={formData.gender === "other"}
              />
              <label htmlFor="other-gender-identity">Other</label>
            </div>

            <label htmlFor="show-gender">Show gender on my profile</label>
            <div className="checkbox-container">
              <input
                id="show-gender"
                type="checkbox"
                name="show_gender"
                onChange={handleChange}
                checked={formData.show_gender}
              />
            </div>

            <label>Show Me</label>

            <div className="multiple-input-container">
              <input
                id="male-gender-interest"
                type="radio"
                name="gender_interest"
                value="male"
                onChange={handleChange}
                checked={formData.gender_interest === "male"}
              />
              <label htmlFor="male-gender-interest">Male</label>
              <input
                id="female-gender-interest"
                type="radio"
                name="gender_interest"
                value="female"
                onChange={handleChange}
                checked={formData.gender_interest === "female"}
              />
              <label htmlFor="female-gender-interest">Female</label>
              <input
                id="everyone-gender-interest"
                type="radio"
                name="gender_interest"
                value="everyone"
                onChange={handleChange}
                checked={formData.gender_interest === "everyone"}
              />
              <label htmlFor="everyone-gender-interest">Everyone</label>
            </div>

            <label htmlFor="about_me">About Me</label>
            <input
              id="about_me"
              type="text"
              name="about_me"
              placeholder="I like long walks..."
              required={true}
              value={formData.about_me}
              onChange={handleChange}
            />
            <input type="submit" />
          </section>

          <section>
            <label htmlFor="url">Profile Picture</label>
            <input
              id="url"
              type="url"
              name="url_1"
              onChange={handleChange}
              required={true}
            />
            <div className="photo-container">
              <img src={formData.url_1} alt="profile pic preview"></img>
            </div>
          </section>
        </form>
      </div>
    </>
  );
}

export default Onboarding;
