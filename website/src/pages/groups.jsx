import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import MainLayout from '../layouts/mainLayout';

const Groups = () => {
  const { token } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/getGroups`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok){
        throw new Error("Failed to fetch groups");
      }
      else{
        const data = await response.json();
        if(data.length>0)
        setGroups(data);
      }

    } catch (error) {
      console.error("Error loading groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <MainLayout>    
        <div className="min-h-screen bg-[#121212] text-[#EBF1D5] p-6">
        <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold mb-6">Groups</h1>
            <p>Add New</p>
          </div>
        {loading ? (
            <p>Loading groups...</p>
        ) : groups.length === 0 ? (
            <p>No groups found.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((expense) => (
                <div key={expense._id} className="bg-[#1E1E1E] p-4 rounded shadow">
                <h2 className="text-xl font-semibold">{expense.title}</h2>
                <p className="text-gray-400">Amount: ₹{expense.amount}</p>
                <p className="text-sm text-gray-500">Category: {expense.category}</p>
                <p className="text-sm text-gray-500">Date: {new Date(expense.date).toLocaleDateString()}</p>
                </div>
            ))}
            </div>
        )}
        </div>
    </MainLayout>
  );
};

export default Groups;
