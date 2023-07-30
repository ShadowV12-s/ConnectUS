console.log(here);
const form = document.getElementById('form');
const serviceName = document.getElementById('serviceName');
const email = document.getElementById('email');
const description = document.getElementById('description');
const date = document.getElementById('date');
const time = document.getElementById('time');
const time2 = document.getElementById('time2');
const hours = document.getElementById('hours');
const location = document.getElementById('location');

form.addEventListener('submit', async e => {
    e.preventDefault();

    // Clear any previous error messages
    clearErrors();

    const isValid = await validates();

    if (isValid) {
        // All fields are valid, so submit the form
        form.submit();
    }
});

// Function to validate the location (address) using Google Maps Geocoding API
async function isValidAddress(address) {
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual Google Maps API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.status === 'OK' && data.results.length > 0) {
        // If the API returns any results, it means the address is valid
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error validating address:', error);
      return false;
    }
  }


  const clearErrors = () => {
    const inputControls = document.querySelectorAll('.input-control');

    inputControls.forEach(inputControl => {
        inputControl.classList.remove('error', 'success');
        const errorDisplay = inputControl.querySelector('.error');
        errorDisplay.innerText = '';
    });
};

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
};

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


function countWords(str) {
    const words = str.trim().split(/\s+/);
    return words.length;
  }

function isFutureDate(selectedDate) {
  const today = new Date();
  const selected = new Date(selectedDate);
  return selected >= today;
}





const validates = async () => {
    const serviceNameValue = serviceName.value.trim();
    const emailValue = email.value.trim();
    const descriptionValue = description.value.trim();
    const dateValue = date.value.trim();
    const timeValue = time.value.trim();
    const time2Value = time2.value.trim();
    const hoursValue = hours.value.trim();
    const locationValue = location.value.trim();

    if(serviceNameValue === '') {
        setError(serviceName, 'Name is required');
    } else {
        setSuccess(serviceName);
    }

    if(emailValue === '') {
        setError(email, 'Email is required');
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
    } else {
        setSuccess(email);
    }

    if(descriptionValue === '') {
        setError(description, 'description is required');
    } else if (countWords(descriptionValue) < 50) {
        setError(description, 'Description must be at least 50 words.');
    } else {
        setSuccess(description);
    }

    if (dateValue === '') {
        setError(date, 'Please add a date');
      } else if (!isFutureDate(dateValue)) {
        setError(date, "Please choose a future date");
      } else {
        setSuccess(date);
    }


    if (timeValue === '') {
        setError(time, 'Please add a starting time');
      } else {
        setSuccess(time);
    }

    if (time2Value === '') {
        setError(time2, 'Please add a date');
      } else {
        setSuccess(time2);
    }
    if (hoursValue === '') {
        setError(hours, 'Please add the total amount of hours');
    } else if (isNaN(hoursValue) || +hoursValue <= 0) {
        setError(hours, 'Please enter a valid number of hours');
    } else {
        setSuccess(hours);
    }

    if (locationValue === '') {
        setError(location, 'Please provide an address');
    } else {
        // Check if the location is a valid address using the Google Maps Geocoding API
        const isValid = await isValidAddress(locationValue);

        if (!isValid) {
            setError(location, 'Invalid address');
        } else {
            setSuccess(location);
        }
    }

};