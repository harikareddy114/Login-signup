const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const signUpForm = document.getElementById('formup');
const signInForm = document.getElementById('formin');


function handleFormSubmit(form, formType) {
	form.addEventListener('submit', (event) => {
	  event.preventDefault();
 
	  const formData = new FormData(form);
	  formData.append('form_type', formType);

	  fetch('/submit', {
		method: 'POST',
		body: JSON.stringify(Object.fromEntries(formData)),
		headers: {
		  'Content-Type': 'application/json',
		},
	  })
		.then((response) => response.text())
		.then((message) => {
		  alert(message);
		})
		.catch((error) => {
		  alert('An error occurred.');
		  console.error('Error:', error);
		});
	});
  }

signUpButton.addEventListener('click', () => {
  container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});

handleFormSubmit(signUpForm, 'sign-up');
handleFormSubmit(signInForm, 'sign-in');
