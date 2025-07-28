import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const listMyEvents = async () => {
    const email = localStorage.getItem("eventHost");
    if (!email) {
      toast.error("Organizer email not found.");
      return;
    }

    try {
      const response = await axios.get(
        `${url}/api/event/my-events?email=${email}`
      );

      if (response.data.success) {
        setList(response.data.events);
      } else {
        toast.error("Error fetching your events");
      }
    } catch (error) {
      toast.error("Network error: Unable to fetch events");
      console.error("List Fetch Error:", error);
    }
  };

  const RemoveEvent = async (eventId) => {
    try {
      const response = await axios.post(`${url}/api/event/remove`, {
        id: eventId,
      });
      if (response.data.success) {
        await listMyEvents(); // ✅ re-fetch your events only
        toast.success(response.data.message);
      } else {
        toast.error("Error deleting event");
      }
    } catch (error) {
      toast.error("Network error: Unable to delete event");
    }
  };

  useEffect(() => {
    listMyEvents(); // ✅ updated function
  }, [url]);

  return (
    <div className="list add flex-col">
      <p>My Events</p> {/* ✅ updated heading */}
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
            <img src={item.coverImage.url} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>Rs.{item.price}</p>
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
