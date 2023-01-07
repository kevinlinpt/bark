import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import TinderCard from "react-tinder-card";
import ChatContainer from "../components/ChatContainer";
import axios from "axios";
import "./Dashboard.scss";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [genderedUsers, setGenderedUsers] = useState(null);
  const [lastDirection, setLastDirection] = useState(); // swipe direction

  const userId = cookies.UserId;

  // sends get request to backend and save logged user's information from db into 'user' variable
  const getUser = async () => {
    try {
      await axios
        .get("http://localhost:8080/user", { params: { userId } })
        .then((res) => {
          setUser(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // get all users that match the user's gender interest
  const getGenderedUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/gendered-users", {
        params: { gender: user?.gender_interest },
      });
      // returns array of objects of users for the specified gender
      setGenderedUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getGenderedUsers();
    }
  }, [user]);

  // updates matches object with user's id and matched user's id
  const updateMatches = async (matchedUserId) => {
    try {
      await axios.put("http://localhost:8080/addmatch", {
        userId,
        matchedUserId,
      });
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  const swiped = (direction, swipedUserId) => {
    if (direction === "right") {
      updateMatches(swipedUserId);
    }
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  // return matched user ids as array instead of array of objects
  const matchedUserIds = user?.matches
    .map(({ user_id }) => user_id)
    .concat(userId); // add own user id inside list of matched user ids

  // filter out matched users from gendered users so it does not display as a potential candidate again
  const filteredGenderedUsers = genderedUsers?.filter(
    (genderedUser) => !matchedUserIds.includes(genderedUser.user_id)
  );

  return (
    <>
      {user && (
        <div className="dashboard">
          <ChatContainer user={user} />
          <div className="swipe-container">
            <div className="card-container">
              {filteredGenderedUsers?.map((genderedUser) => (
                <TinderCard
                  className="swipe"
                  key={genderedUser.user_id}
                  onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
                  onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}
                >
                  <div
                    style={{
                      backgroundImage: "url(" + genderedUser.url_1 + ")",
                    }}
                    className="card"
                  >
                    <h3>{genderedUser.first_name}</h3>
                  </div>
                </TinderCard>
              ))}
              <div className="swipe-info">
                {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Dashboard;
