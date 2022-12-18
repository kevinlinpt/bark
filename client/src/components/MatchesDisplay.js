import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MatchesDisplay.scss";

function MatchesDisplay({ matches }) {
  const [matchedProfiles, setMatchedProfiles] = useState(null);

  console.log(matches);

  const matchedUserIds = matches.map(({ user_id }) => user_id);

  const getMatches = async () => {
    try {
      await axios
        .get("http://localhost8080/users", {
          params: { userIds: JSON.stringify(matchedUserIds) },
        })
        .then((res) => {
          console.log(res)
          setMatchedProfiles(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMatches();
  }, [matches]);

  console.log(matchedProfiles);

  return <div className="matches-display"></div>;
}

export default MatchesDisplay;
