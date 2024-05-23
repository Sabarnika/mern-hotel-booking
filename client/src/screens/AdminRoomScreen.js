import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Input, Space, Popconfirm, message } from "antd";

import Loader from "../components/Loader";
import Error from "../components/Error";

const { Search } = Input;

function AdminRoomScreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingRoom, setEditingRoom] = useState(null); // State to track the room being edited
  const [updatedName, setUpdatedName] = useState("");
  const [updatedMaxCount, setUpdatedMaxCount] = useState("");
  const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState("");
  const [updatedRentPerDay, setUpdatedRentPerDay] = useState("");
  const [updatedType, setUpdatedType] = useState("");

  const columns = [
    {
      title: "roomid",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    { title: "maxcount", dataIndex: "maxcount", key: "maxcount" },
    { title: "phonenumber", dataIndex: "phonenumber", key: "phonenumber" },
    { title: "rentperday", dataIndex: "rentperday", key: "rentperday" },
    { title: "type", dataIndex: "type", key: "type" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => setEditingRoom(record)}>Update</Button>
          <Popconfirm
            title="Are you sure to delete this room?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  async function fetchMyData() {
    setError("");
    setLoading(true);
    try {
      const data = (await axios.post("https://hotel-manis-lodge.onrender.com/api/rooms/getallrooms")).data;
      setRooms(data);
    } catch (error) {
      console.log(error);
      setError(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchMyData();
  }, []);

  useEffect(() => {
    if (editingRoom) {
      // Set initial values of updated inputs to current room values
      setUpdatedName(editingRoom.name);
      setUpdatedMaxCount(editingRoom.maxcount);
      setUpdatedPhoneNumber(editingRoom.phonenumber);
      setUpdatedRentPerDay(editingRoom.rentperday);
      setUpdatedType(editingRoom.type);
    }
  }, [editingRoom]);

  const handleUpdateRoom = async () => {
    try {
      const updatedRoomData = {
        _id: editingRoom._id,
        name: updatedName,
        maxcount: updatedMaxCount,
        phonenumber: updatedPhoneNumber,
        rentperday: updatedRentPerDay,
        type: updatedType,
      };
      await axios.put(`https://hotel-manis-lodge.onrender.com/api/rooms/updateroom/${editingRoom._id}`, updatedRoomData);
      fetchMyData(); // Refresh room data after update
      setEditingRoom(null); // Reset editing room state
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  const handleDelete = async (roomId) => {
    try {
      await axios.delete(`https://hotel-manis-lodge.onrender.com/api/rooms/deleteroom/${roomId}`);
      message.success("Room deleted successfully");
      fetchMyData(); // Refresh room data after deletion
    } catch (error) {
      console.error("Error deleting room:", error);
      message.error("Failed to delete room");
    }
  };

  return (
    <div className="row">
      {loading ? (
        <Loader />
      ) : error.length > 0 ? (
        <Error msg={error} />
      ) : (
        <>
          <div className="col-md-12">
            <Button onClick={fetchMyData} type="primary" style={{ marginBottom: 16 }}>
              Refresh
            </Button>
          </div>
          <div className="col-md-10">
            <Table columns={columns} dataSource={rooms} />
            {editingRoom && (
              <div>
                <h2>Update Room</h2>
                <Input
                  placeholder="Name"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                />
                <br/>
                <br/>
                <Input
                  placeholder="Max Count"
                  value={updatedMaxCount}
                  onChange={(e) => setUpdatedMaxCount(e.target.value)}
                />
                <br/>
                <br/>
                <Input
                  placeholder="Phone Number"
                  value={updatedPhoneNumber}
                  onChange={(e) => setUpdatedPhoneNumber(e.target.value)}
                />
                <br/>
                <br/>
                <Input
                  placeholder="Rent Per Day"
                  value={updatedRentPerDay}
                  onChange={(e) => setUpdatedRentPerDay(e.target.value)}
                />
                <br/>
                <br/>
                <Input
                  placeholder="Type"
                  value={updatedType}
                  onChange={(e) => setUpdatedType(e.target.value)}
                />
                <br/>
                <br/>
                <Button onClick={handleUpdateRoom} type="primary" style={{ marginLeft: 8 }}>
                  Update
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminRoomScreen;
