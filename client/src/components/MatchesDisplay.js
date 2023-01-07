import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import "./MatchesDisplay.scss";

function MatchesDisplay({ matches, setClickedUser }) {
  const [matchedProfiles, setMatchedProfiles] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const userId = cookies.UserId;
  // deconstruct matched user ids
  const matchedUserIds = matches.map(({ user_id }) => user_id);

  // pass array of matches to /users endpoint in the backend
  const getMatches = async () => {
    try {
      await axios
        .get("http://localhost:8080/users", {
          params: { userIds: JSON.stringify(matchedUserIds) }, // stringify the array: matchedUserIds = ['test-2', 'test-3']
        })
        .then((res) => {
          setMatchedProfiles(res.data); // array of objects with data of all matched users
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMatches();
  }, [matches]);

  // filter ONLY users that have also matched with us (both of us have swiped right) to display in our matches
  const filteredMatchedProfiles = matchedProfiles?.filter(
    (matchedProfile) =>
      matchedProfile.matches.filter((profile) => profile.user_id == userId)
        .length > 0
  );

  return (
    <div className="matches-display">
      {filteredMatchedProfiles?.map((match) => (
        <div
          key={match.user_id}
          className="match-card"
          onClick={() => setClickedUser(match)} // need callback otherwise automatically performs setClickedUser
        >
          <div className="matched-img-container">
            <img src={match?.url_1} alt={match?.first_name + " profile"}></img>
          </div>
          <h3 className="matched-username">{match?.first_name}</h3>
        </div>
      ))}
    </div>
  );
}

export default MatchesDisplay;
