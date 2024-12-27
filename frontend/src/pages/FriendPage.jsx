import { useEffect, useState } from "react";
import { fetchFriends } from "../../utils/fetchFriends";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useFriendListStore } from "../../store/useFriendListStore";
import { useSocketStore } from "../../store/useSocketStore";

export const FriendPage = () => {
  // const {socket} = useSocketStore()
  const {setFriendList , friendList } = useFriendListStore()
  const { profileId } = useParams(); // Current user's profile ID
  const [friends, setFriends] = useState([]); // State to store friends

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const fetchedFriends = await fetchFriends(profileId); // Fetch friends from backend
        setFriends(fetchedFriends); // Update state
        setFriendList(fetchedFriends) //global states 
        
      } catch (error) {
        console.error("Failed to load friends:", error);
      }
    };
    loadFriends();
  }, [profileId , setFriendList]);

  // useEffect(() => {
  //   console.log('this is socket',socket)
  //   if (socket) {
  //     socket.on("friendRequestSent", (data) => {
  //       console.log("Friend request received:", data);
  //       setFriends((prev) => [...prev, data])
  //       setFriendList((prev) => [...prev, data]);
  //     });

  //     // Cleanup function to remove the event listener
  //     return () => {
  //       socket.off("friendRequestSent");
  //     };
  //   }
  // }, [socket, setFriendList]);

  //used for debugging state
  useEffect(() => {
    console.log("this is the friendList from useFriendListStore at friendpage:", friendList);
  }, [friendList]);

  // Accept friend request
  const handleAccept = async () => {
    try {
      await axios.patch(`http://localhost:3000/friends/${profileId}`, {
        friendList,
        status: "accepted",
      });
      console.log('handleaccpet clicked , friendId:', friendList)
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  // Reject friend request
  const handleReject = async (friendId) => {
    try {
      await axios.delete(`http://localhost:3000/friends/${profileId}`, {
        data: { friendId },
      });
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  return (
    <div className="friend-page p-4 bg-[#3c3f43] text-white w-full h-full">
      <h1 className="text-2xl font-bold mb-4">Friends</h1>

      {/* Pending Friend Requests */}
      <div className="friend-requests mb-8">
        <h2 className="text-xl font-semibold mb-2">Pending Friend Requests</h2>
        <ul className="space-y-4">
          {friends
            .filter((friend) => friend.status === "pending")
            .map((friend) => (
              <li
                key={friend._id}
                className="flex items-center justify-between bg-[#3c3f43] p-4 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={friend.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
                  />
                  <span>{friend.username}</span>
                </div>
                {/* if you are receiver, render buttons.  */}
                {friend.receiverId === profileId && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAccept(friend.profileId)}
                      className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(friend.senderId)}
                      className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600"
                    >
                      Decline
                    </button>
                  </div>
                )}
                {/* if you are sender, render request pending */}
                {friend.senderId === profileId && (
                  <div className="text-sm text-gray-400">Request Pending</div>
                )}
              </li>
            ))}
        </ul>
      </div>

      {/* Accepted Friends */}
      <div className="accepted-friends">
        <h2 className="text-xl font-semibold mb-2">Accepted Friends</h2>
        <ul className="space-y-4">
          {friends
            .filter((friend) => friend.status === "accepted")
            .map((friend) => (
              <li
                key={friend._id}
                className="flex items-center justify-between bg-[#3c3f43] p-4 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={friend.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
                  />
                  <span>{friend.username}</span>
                  <span>{friend.senderId || friend.receiverId}</span>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
