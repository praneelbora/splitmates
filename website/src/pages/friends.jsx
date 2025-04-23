import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import MainLayout from '../layouts/mainLayout';
import Modal from '../components/FriendsModal';

const Friends = () => {
  const { token } = useAuth();
  const [friends, setFriends] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/friends/`, {
        headers: {
          "Content-Type": "application/json",
          'x-auth-token': token,
        },
      });

      if (!response.ok){
        throw new Error("Failed to fetch friends");
      }
      else{
        const data = await response.json();
        if(data.length>0)
        setFriends(data);
      }

    } catch (error) {
      console.error("Error loading friends:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <MainLayout>    
        <div className="max-h-screen bg-[#121212] text-[#EBF1D5] p-6 overflow-hidden">
          <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold mb-6">Friends</h1>
            <button className="border-[1px] h-[40px] px-2 rounded-md" onClick={()=>setShowModal(true)}>Add New</button>
          </div>
        

        {loading ? (
            <p>Loading friends...</p>
        ) : friends.length === 0 ? (
            <p>No friends found.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend,index) => (
                <div key={friend._id}>
                <h2 className="text-xl font-semibold">{friend.name}</h2>
                </div>
            ))}
            </div>
        )}
        </div>
        <Modal setShowModal={setShowModal} showModal={showModal} fetchFriends={fetchFriends}/>
    </MainLayout>
  );
};

export default Friends;
