const form = document.getElementById('form');
const serviceName = document.getElementById('serviceName');
const email = document.getElementById('email');
const description = document.getElementById('description');
const date = document.getElementById('date');
const time = document.getElementById('time');
const time2 = document.getElementById('time2');
const hours = document.getElementById('hours');
const address = document.getElementById('address');
const submit = document.getElementById('submit');

form.addEventListener('click', async e => {

  // Call the validation function before allowing the form submission
  await validates();

  // Check if all fields are marked as successful, then submit the form
  if (document.querySelectorAll('.error').length === 0) {
    console.log('Form submitted!');
    form.submit();
  }
})

const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  element.classList.add("invalid")
  submit.disabled=true;

  errorDisplay.innerText = message;
  inputControl.classList.add('error');
  inputControl.classList.remove('success')
}

const setSuccess = element => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

element.classList.remove("invalid");
if (document.querySelector(".invalid") == null) {
  submit.disabled=false;
}

  errorDisplay.innerText = '';
  inputControl.classList.add('success');
  inputControl.classList.remove('error');
};

  


  const validates =  () => {
    const serviceNameValue = serviceName.value.trim();
    const emailValue = email.value.trim();
    const descriptionValue = description.value.trim();
    const dateValue = date.value.trim();
    const timeValue = time.value.trim();
    const time2Value = time2.value.trim();
    const hoursValue = hours.value.trim();
    const addressValue = address.value.trim();


    if(serviceNameValue === '') {
        setError(serviceName, "Name is required");
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
        setError(description, "description is required");
    } else if (countWords(descriptionValue) < 20) {
        setError(description, "Description must be at least 20 words.");
    } else {
        setSuccess(description);
    }

    if (dateValue === '') {
        setError(date, "Please add a date");
      } else if (!isFutureDate(dateValue)) {
        setError(date, "Please choose a future date");
      } else {
        setSuccess(date);
    }


    if (timeValue === '') {
        setError(time, "Please add a starting time");
      } else {
        setSuccess(time);
    }

    if (time2Value === '') {
        setError(time2, "Please add a date");
      } else {
        setSuccess(time2);
    }
    if (hoursValue === '') {
        setError(hours, "Please add the total amount of hours");
    } else if (isNaN(hoursValue) || +hoursValue <= 0) {
        setError(hours, "Please enter a valid number of hours");
    } else {
        setSuccess(hours);
    }

    if (addressValue === '') {
      setError(address, "Please provide an address");
  } else {
      // Check if the address is a valid address using the Google Maps Geocoding API
      isValidAddress(addressValue)
          .then(isValid => {
              if (!isValid) {
                  setError(address, "Invalid address");
              } else {
                  setSuccess(address);
              }
          })
          .catch(error => {
              console.error('Error validating address:', error);
              setError(address, "An error occurred while validating the address");
          });
  }

}




const isValidEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};


function countWords(description) {
    const words = description.trim().split(/\s+/);
    return words.length;
  }

function isFutureDate(date) {
  const today = new Date();
  const selected = new Date(date);
  return selected >= today;
}



// Function to validate the address (address) using Google Maps Geocoding API
async function isValidAddress(address) {
  const apiKey = 'AIzaSyBSB1hj5zOoOfI6Kcw8xDjSA0LcvhDcJQE'; 
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
        // If the API returns any results, it means the address is valid
        return true;
    } else {
        console.log('Geocoding API response:', data);
        return false;
    }
} catch (error) {
    throw error;
}
}

