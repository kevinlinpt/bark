import React, { useState, useRef, useMemo, useEffect } from "react";
import { useCookies } from "react-cookie";
import TinderCard from "react-tinder-card";
import ChatContainer from "../components/ChatContainer";
import axios from "axios";
import "./Dashboard.scss";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const userId = cookies.UserId;
  // sends get request to backend and save response as user
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

  useEffect(() => {
    getUser();
  }, []);

  console.log("user", user);

  const characters = [
    {
      name: "Gohan",
      url: "https://imgur.com/p2mewNT.jpg",
    },
    {
      name: "Erlich Bachman",
      url: "https://imgur.com/haG7f1j.jpg",
    },
    {
      name: "Monica Hall",
      url: "https://imgur.com/haG7f1j.jpg",
    },
    {
      name: "Jared Dunn",
      url: "https://imgur.com/haG7f1j.jpg",
    },
    {
      name: "Loki",
      url: "https://imgur.com/haG7f1j.jpg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(characters.length - 1);
  const [lastDirection, setLastDirection] = useState();
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(characters.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < characters.length - 1;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < characters.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  return (
    <div className="dashboard">
      <ChatContainer user={ user }/>
      <div className="swipe-container">
        <div className="card-container">
          {characters.map((character, index) => (
            <TinderCard
              ref={childRefs[index]}
              className="swipe"
              key={character.name}
              onSwipe={(dir) => swiped(dir, character.name, index)}
              onCardLeftScreen={() => outOfFrame(character.name, index)}
            >
              <div
                style={{ backgroundImage: "url(" + character.url + ")" }}
                className="card"
              >
                <h3>{character.name}</h3>
              </div>
            </TinderCard>
          ))}
        </div>
        <div className="buttons">
          <button
            style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
            onClick={() => swipe("left")}
          >
            Swipe left!
          </button>
          <button
            style={{ backgroundColor: !canGoBack && "#c3c4d3" }}
            onClick={() => goBack()}
          >
            Undo swipe!
          </button>
          <button
            style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
            onClick={() => swipe("right")}
          >
            Swipe right!
          </button>
        </div>
        {lastDirection ? (
          <h2 key={lastDirection} className="swipe-info">
            You swiped {lastDirection}
          </h2>
        ) : (
          <h2 className="swipe-info">Swipe right to match!</h2>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
