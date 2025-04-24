import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../context/authContext";
import MainLayout from "../layouts/mainLayout";
import Login from "./Login";

const GroupDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [group, setGroup] = useState(null);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState();
  const [selectedMember, setSelectedMember] = useState(null);
  const filteredExpenses = selectedMember
  ? groupExpenses.filter(exp =>
      exp.splits.some(s =>
        s.friendId &&
        s.friendId._id === selectedMember &&
        (s.payAmount > 0 || s.oweAmount > 0)
      )
    )
  : groupExpenses;

  const getPayerInfo = (splits) => {
    const userSplit = splits.find(s => s.friendId && s.friendId._id === userID);
  
    // Not involved if user not found or no amounts owed/paid
    if (!userSplit || (!userSplit.payAmount && !userSplit.oweAmount)) {
      return "You were not involved";
    }
  
    const payers = splits.filter(s => s.paying && s.payAmount > 0);
    if (payers.length === 1) {
      return `${payers[0].friendId.name} paid`;
    } else if (payers.length > 1) {
      return `${payers.length} people paid`;
    } else {
      return `No one paid`;
    }
  };
  
  

  
  const fetchGroup = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/groups/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to fetch group");

      setGroup(data);
    } catch (err) {
      console.error("Error loading group:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchGroupExpenses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/expenses/group/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to fetch group");
      console.log(data.group.expenses);
      
      setGroupExpenses(data.group.expenses);
      setUserID(data.id)
    } catch (err) {
      console.error("Error loading group:", err);
    } finally {
      setLoading(false);
    }
  };
  const getOweInfo = (splits) => {
    const userSplit = splits.find(s => s.friendId && s.friendId._id === userID);
  
    if (!userSplit) return null;
  
    const { oweAmount = 0, payAmount = 0 } = userSplit;
  
    const net = payAmount - oweAmount;
  
    if (net > 0) {
      return {text:'you lent', amount:` ₹${net.toFixed(2)}`};
    } else if (net < 0) {
      return {text:'you borrowed', amount:` ₹${Math.abs(net).toFixed(2)}`};
    } else {
      return null;
    }
  };
  
  
  useEffect(() => {
    fetchGroup();
    fetchGroupExpenses();
  }, [id]);

  return (
    <MainLayout>
      <div className="text-[#EBF1D5]">
        {loading ? (
          <p>Loading...</p>
        ) : !group ? (
          <p>Group not found</p>
        ) : (
          <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-[14px] uppercase">Group Name</p>
            <h1 className="text-3xl font-bold">{group.name}</h1>
          </div>
            <hr />
            <div className="flex flex-col">
            <p className="text-[14px] my-2 uppercase">Members</p>
            
            <div className="flex flex-wrap gap-2">
                {group.members.map((member) => (
                  <button
                    key={member._id}
                    onClick={() => (selectedMember==member._id)?setSelectedMember(null):setSelectedMember(member._id)}
                    className={`px-3 py-1 rounded-full font-semibold border text-sm capitalize transition ${
                      selectedMember === member._id
                        ? 'bg-green-300 border-green-300 text-black'
                        : 'text-[#EBF1D5] border-[#EBF1D5]'
                    }`}
                  >
                    {member.name}
                  </button>
                ))}
              </div>

              </div>
              <hr />
              <div className="flex flex-col">
            <p className="text-[14px] my-2 uppercase">Expenses</p>
            <ul className="flex flex-col w-full gap-2">
              {filteredExpenses.map((exp) => (
                <div key={exp._id} className="flex flex-row w-full items-center gap-3 min-h-[50px]">
                {/* Left date block */}
                <div className="flex flex-col justify-center items-center">
                  <p className="text-[14px] uppercase">
                    {(new Date(exp.createdAt)).toLocaleString('default', { month: 'short' })}
                  </p>
                  <p className="text-[22px] -mt-[6px]">
                    {(new Date(exp.createdAt)).getDate().toString().padStart(2, '0')}
                  </p>
                </div>
              
                {/* Vertical partition */}
                <div className="w-[2px] my-[2px] bg-[#EBF1D5] opacity-50 self-stretch"></div>
              
                {/* Right content */}
                <div className="flex grow flex-row justify-between">
                <div className="flex flex-col justify-center">
                  <p className="text-[22px] capitalize">{exp.description}</p>
                  <p className="text-[14px] text-[#81827C] capitalize -mt-[6px]">
                    {getPayerInfo(exp.splits)} {getPayerInfo(exp.splits)!="You were not involved" && `₹${exp.amount.toFixed(2)}`}
                  </p>
                </div>
                <div className="flex flex-col justify-center items-end">
                  <p className="text-[14px]">{getOweInfo(exp.splits)?.text}</p>
                  <p className="text-[22px] capitalize -mt-[6px]">{getOweInfo(exp.splits)?.amount}</p>
                </div>
                </div>
              </div>
              
              ))}
            </ul>
              </div>
              <hr />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default GroupDetails;
