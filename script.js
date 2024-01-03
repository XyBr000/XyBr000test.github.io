// When the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Event listener for the rota form submission
  document.getElementById("rotaForm").onsubmit = async (e) => {
    e.preventDefault();

    // Construct the URL with query parameters from the form
    const baseUrl =
      "https://rota-app-1f29bae8732d.herokuapp.com/create_weekly_rota"; // Replace with your actual API endpoint
    const params = new URLSearchParams({
      debug_mode: "false",
      monday_staff_requirement: document.getElementById(
        "monday_staff_requirement"
      ).value,
      tuesday_staff_requirement: document.getElementById(
        "tuesday_staff_requirement"
      ).value,
      wednesday_staff_requirement: document.getElementById(
        "wednesday_staff_requirement"
      ).value,
      thursday_staff_requirement: document.getElementById(
        "thursday_staff_requirement"
      ).value,
      friday_staff_requirement: document.getElementById(
        "friday_staff_requirement"
      ).value,
      saturday_staff_requirement: document.getElementById(
        "saturday_staff_requirement"
      ).value,
      sunday_staff_requirement: document.getElementById(
        "sunday_staff_requirement"
      ).value,
    });

    const urlWithParams = `${baseUrl}?${params.toString()}`;

    // Making the API call
    try {
      const response = await fetch(urlWithParams, {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      });

      const result = await response.json();
      console.log(result);
      // Call fetchStaffData function here after successful form submission
      fetchStaffData();
      fetchRotaData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  async function fetchStaffData() {
    try {
      console.log("Attempting to fetch staff data"); // Log attempt
      const response = await fetch(
        "https://rota-app-1f29bae8732d.herokuapp.com/get_all_staff",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            // Add other headers as required by your API
          },
        }
      );

      const staffData = await response.json();
      console.log("Staff Data Received:", staffData); // Log received data
      displayStaffData(staffData);
      startFetchingRotaDataPeriodically();
    } catch (error) {
      console.error("Error fetching staff data:", error);
    }
  }

  // Function to display staff data on the page
  function displayStaffData(data) {
    const staffList = document.getElementById("staffList");
    staffList.innerHTML = ""; // Clearing the list

    // Loop through the data and create list items for each staff member
    for (const [name, details] of Object.entries(data)) {
      const item = document.createElement("li");
      item.textContent = `${name}: ${details.join(", ")}`;
      staffList.appendChild(item);
    }
  }

  fetchStaffData();
  fetchRotaData();

  // Schedule the fetchRotaData function to run every 5 seconds
  function startFetchingRotaDataPeriodically(intervalMs = 5000) {
    setInterval(() => {
      // Invoke the function to fetch rota data
      console.log("Fetching rota data...");
      fetchRotaData();
    }, intervalMs);
  }

  async function fetchRotaData() {
    try {
      const response = await fetch(
        "https://rota-app-1f29bae8732d.herokuapp.com/get_rota",
        {
          method: "POST", // Or 'POST', depending on your API method
          headers: {
            accept: "application/json",
          },
        }
      );
      const rotaData = await response.json();
      displayRota(rotaData);
    } catch (error) {
      console.error("Error fetching rota data:", error);
    }
  }

  function displayRota(rotaData) {
    const rotaContainer = document.getElementById("rotaContainer"); // Ensure this container exists in your HTML
    rotaContainer.innerHTML = ""; // Clear previous rota data

    const daysOfWeekOrdered = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    daysOfWeekOrdered.forEach((day) => {
      const shifts = rotaData[day]; // Access the shifts for the day
      if (!shifts) return; // If there's no data for the day, skip it

      const daySection = document.createElement("div");
      const dayHeading = document.createElement("h2");
      dayHeading.textContent = day;
      daySection.appendChild(dayHeading);

      const shiftList = document.createElement("ul");
      shifts.forEach((shift) => {
        const shiftItem = document.createElement("li");
        shiftItem.textContent = `${shift.name}: ${shift.start_time} - ${shift.end_time}`;
        shiftList.appendChild(shiftItem);
      });

      daySection.appendChild(shiftList);
      rotaContainer.appendChild(daySection);
    });
  }

  // Function to add a note to a staff member
  async function addNoteToUser(userName, note) {
    const response = await fetch(
      `https://rota-app-1f29bae8732d.herokuapp.com/add_note_to_user?user_name=${encodeURIComponent(
        userName
      )}&note=${encodeURIComponent(note)}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          // Add other headers as required
        },
      }
    );
    fetchStaffData();
    fetchRotaData(); // Refresh staff data after updating the note
  }
  // Function to add a hour to a staff member
  async function addHourToUser(userName, hour) {
    const response = await fetch(
      `https://rota-app-1f29bae8732d.herokuapp.com/add_hour_requirement_to_user?user_name=${encodeURIComponent(
        userName
      )}&hour_requirement=${encodeURIComponent(hour)}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          // Add other headers as required
        },
      }
    );
    fetchStaffData();
    fetchRotaData(); // Refresh staff data after updating the hour
  }

  // Function to add a shift to a staff member
  async function addShiftToUser(userName, shift) {
    const response = await fetch(
      `https://rota-app-1f29bae8732d.herokuapp.com/add_desired_shift_length_to_user?user_name=${encodeURIComponent(
        userName
      )}&desired_hours=${encodeURIComponent(shift)}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          // Add other headers as required
        },
      }
    );
    fetchStaffData();
    fetchRotaData(); // Refresh staff data after updating the shift
  }


  function createNoteSection(userName, currentNote) {
    const noteSection = document.createElement("div");
    const noteInput = document.createElement("input");
    noteInput.type = "text";
    noteInput.value = currentNote.replace("NOTE - ", ""); // Pre-fill with current note
    const updateButton = document.createElement("button");
    updateButton.textContent = "Update Note";
    updateButton.addEventListener("click", async () => {
      await addNoteToUser(userName, noteInput.value);
      // Optionally, you can directly update just the note display instead of refetching all data
    });

    noteSection.appendChild(noteInput);
    noteSection.appendChild(updateButton);

    return noteSection;
  }
  function createHourSection(userName, currentHour) {
    const hourSection = document.createElement("div");
    const hourInput = document.createElement("input");
    hourInput.type = "text";
    hourInput.value = currentHour.replace("Hour Requirement - ", ""); // Pre-fill with current hour
    const updateButton = document.createElement("button");
    updateButton.textContent = "Update Hour";
    updateButton.addEventListener("click", async () => {
      await addHourToUser(userName, hourInput.value);
      // Optionally, you can directly update just the hour display instead of refetching all data
    });

    hourSection.appendChild(hourInput);
    hourSection.appendChild(updateButton);

    return hourSection;
  }

  function createShiftSection(userName, currentShift) {
    const shiftSection = document.createElement("div");
    const shiftInput = document.createElement("input");
    shiftInput.type = "text";
    shiftInput.value = currentShift.replace("Desired Shift Length - ", ""); // Pre-fill with current shift
    const updateButton = document.createElement("button");
    updateButton.textContent = "Update Shift";
    updateButton.addEventListener("click", async () => {
      await addShiftToUser(userName, shiftInput.value);
      // Optionally, you can directly update just the shift display instead of refetching all data
    }
    );

    shiftSection.appendChild(shiftInput);
    shiftSection.appendChild(updateButton);

    return shiftSection;
  }
    

  function displayStaffData(data) {
    const staffList = document.getElementById("staffList");
    staffList.innerHTML = ""; // Clear the list first

    Object.entries(data).forEach(([name, details]) => {
      const staffSection = document.createElement("div");
      staffSection.className = "staff-member";

      const staffName = document.createElement("h3");
      staffName.textContent = name;
      staffSection.appendChild(staffName);

      const availabilityList = document.createElement("ul");

      [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ].forEach((day) => {
        const listItem = document.createElement("li");
        const isAvailable = details.includes(day);
        listItem.textContent = `${day}: ${
          isAvailable ? "Available" : "Unavailable"
        }`;

        // Add a toggle button for each day
        const toggleButton = createToggleButton(isAvailable, name, day);
        listItem.appendChild(toggleButton);

        availabilityList.appendChild(listItem);
      });

      staffSection.appendChild(availabilityList);

      // Find the current note or provide a default if none exists
      const noteIndex = details.findIndex((detail) =>
        detail.startsWith("NOTE -")
      );
      const currentNote = noteIndex !== -1 ? details[noteIndex] : "NOTE - ";

      // Create and append the note section
      const noteSection = createNoteSection(name, currentNote);
      staffSection.appendChild(noteSection);

      // Find the current hour requirement or provide a default if none exists
      const hourIndex = details.findIndex((detail) =>
        detail.startsWith("Hour Requirement -")
      );
      const currentHour =
        hourIndex !== -1 ? details[hourIndex] : "Hour Requirement - ";

      // Create and append the hour section
      const hourSection = createHourSection(name, currentHour);
      staffSection.appendChild(hourSection);

      // Find the current shift length or provide a default if none exists
      const shiftIndex = details.findIndex((detail) =>
        detail.startsWith("Desired Shift Length -")
      );
      const currentShift =
        shiftIndex !== -1 ? details[shiftIndex] : "Desired Shift Length - ";

      // Create and append the shift section
      const shiftSection = createShiftSection(name, currentShift);
      staffSection.appendChild(shiftSection);


      // Find the current role or provide a default if none exists
      const roleIndex = details.findIndex((detail) =>
        detail.startsWith("ROLE -")
      );
      if (roleIndex !== -1) {
        const role = document.createElement("p");
        role.textContent = `Role: ${details[roleIndex].substring(7)}`; // Remove "ROLE - " part
        staffSection.appendChild(role);
      }

      staffList.appendChild(staffSection);
    });
  }
  function createToggleButton(isAvailable, userName, day) {
    const toggleButton = document.createElement("button");
    toggleButton.textContent = isAvailable
      ? "Set Unavailable"
      : "Set Available";
    toggleButton.addEventListener("click", async () => {
      if (isAvailable) {
        await removeDayFromUser(userName, day);
      } else {
        await addDayToUser(userName, day);
      }
      // After the update, re-fetch the staff data to refresh the display
      fetchStaffData();
      fetchRotaData();
    });
    return toggleButton;
  }

  displayStaffData();
  // Function to add a day to a user's availability
  async function addDayToUser(userName, day) {
    const response = await fetch(
      `https://rota-app-1f29bae8732d.herokuapp.com/add_day_to_user?user_name=${encodeURIComponent(
        userName
      )}&day=${encodeURIComponent(day)}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          // Add other headers as required
        },
      }
    );
    fetchStaffData();
    fetchRotaData();
  }

  // Function to remove a day from a user's availability
  async function removeDayFromUser(userName, day) {
    const response = await fetch(
      `https://rota-app-1f29bae8732d.herokuapp.com/remove_day_from_user?user_name=${encodeURIComponent(
        userName
      )}&day=${encodeURIComponent(day)}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          // Add other headers as required
        },
      }
    );
    fetchStaffData();
    fetchRotaData();
  }
  fetchRotaData(); // Fetch rota data when the page loads
});
