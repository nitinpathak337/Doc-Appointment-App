import React, { Component } from "react";
import { Link } from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import "./index.css";

export class Calendar extends Component {
  //initializing state
  state = { events: [] };

  //fetching appointment details from backend on rendering
  componentDidMount() {
    this.getAppointments();
  }

  //api to fetch all the appointments
  getAppointments = async () => {
    const response = await fetch("http://localhost:3001/get");
    const data = await response.json();
    console.log(data);
    this.setState({ events: data });
  };

  //adding appointment to the database when clicking on calendar
  onClickDate = async (info) => {
    console.log(info);
    let eventName = prompt("Enter Your Name-Appointment Description");

    if (eventName !== null && eventName !== "") {
      const appointmentDetails = {
        title: eventName,
        start: info.date,
        end: null,
        description: "Click to delete",
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentDetails),
      };

      //add api
      const response = await fetch("http://localhost:3001/add", options);
      if (response.ok === true) {
        await this.getAppointments();
        const msg = await response.text();
        alert(msg);
      }
    }
  };

  //updating appointment in database on drag & drop
  onDragAndDrop = async (info) => {
    const updatedAppointmentDetails = {
      start: info.event.start,
      id: info.event._def.extendedProps._id,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAppointmentDetails),
    };
    const response = await fetch("http://localhost:3001/update", options);
    if (response.ok === true) {
      const msg = await response.text();
      alert(msg);
    }
  };

  //deleting appointment in database
  deleteEvent = async (info) => {
    console.log(info);
    const deleteAppointmentDetails = {
      id: info.event._def.extendedProps._id,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleteAppointmentDetails),
    };
    const response = await fetch("http://localhost:3001/delete", options);
    if (response.ok === true) {
      await this.getAppointments();
      const msg = await response.text();
      alert(msg);
    }
  };

  //updating appointment in database on resizing
  onResize = async (info) => {
    console.log(info.event.end);
    console.log(info.event.start);
    console.log(info);
    const updatedAppointmentDetails = {
      start: info.event.start,
      id: info.event._def.extendedProps._id,
      end: info.event.end,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAppointmentDetails),
    };
    const response = await fetch("http://localhost:3001/updateSize", options);
    if (response.ok === true) {
      const msg = await response.text();
      alert(msg);
    }
  };

  //rendering user interface
  render() {
    const events = this.state;
    return (
      <div className="bg">
        <div className="info-div">
          <h1 className="heading">Doc Appointment App</h1>
          <Link to="/doctor" className="link">
            <button type="button" className="btn">
              Switch to Doctor
            </button>
          </Link>
          <p className="para">
            => To add an appointment : Click on the date & time on the calendar,
            where you want to add appointment
          </p>
          <p className="para">
            => To delete an appointment : Click on the appointment
          </p>
        </div>

        <div className="calendar">
          <FullCalendar
            editable
            initialView="timeGridWeek"
            headerToolbar={{
              start: "today prev,next",
              center: `title`,
              end: "timeGridWeek,timeGridDay",
            }}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            events={events}
            dateClick={this.onClickDate}
            eventDrop={this.onDragAndDrop}
            eventResize={this.onResize}
            eventClick={this.deleteEvent}
            timeZone="local"
          />
        </div>
      </div>
    );
  }
}

export default Calendar;
