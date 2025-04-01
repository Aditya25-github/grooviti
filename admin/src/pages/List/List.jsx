import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const listEvent = async () => {
    try {
      const response = await axios.get(`${url}/api/event/list`);
      console.log(response.data); // ✅ Debugging: Check API response
      if (response.data.sucess) {
        // ✅ Fix typo
        setList(response.data.data);
      } else {
        toast.error("Error fetching events");
      }
    } catch (error) {
      toast.error("Network error: Unable to fetch events");
    }
  };

  const RemoveEvent = async (eventId) => {
    try {
      const response = await axios.post(`${url}/api/event/remove`, {
        id: ObjectId,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        await listEvent();
      } else {
        toast.error("Error deleting event");
      }
    } catch (error) {
      toast.error("Network error: Unable to delete event");
    }
  };

  useEffect(() => {
    listEvent();
  }, [url]);

  return (
    <div className="list add flex-col">
      <p>All Events List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item) => (
          <div key={item._id} className="list-table-format">
            <img src={`${url}/images/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <button onClick={() => RemoveEvent(item._id)} className="cursor">
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
