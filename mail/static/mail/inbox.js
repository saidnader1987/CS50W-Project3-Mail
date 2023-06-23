// add event listeners to navigation buttons after the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Use buttons to toggle between views
  document
    .querySelector("#inbox")
    .addEventListener("click", () => load_mailbox("inbox"));
  document
    .querySelector("#sent")
    .addEventListener("click", () => load_mailbox("sent"));
  document
    .querySelector("#archived")
    .addEventListener("click", () => load_mailbox("archive"));
  document.querySelector("#compose").addEventListener("click", compose_email);

  // By default, load the inbox
  load_mailbox("inbox");

  // selecting form and input fields
  const emailForm = document.querySelector("#compose-form");

  // adding event listener to form
  emailForm.addEventListener("submit", (e) => {
    // prevents form from submitting.
    e.preventDefault();
    sendMail();
  });

  // Using event delegation to attach event handler to every email: better for perfomance
  document
    .querySelector("#emails-view")
    .addEventListener("click", function (e) {
      // Matching strategy
      const clicked = e.target.closest(".email-row");
      if (clicked) {
        const id = clicked.dataset.id;
        displayMail(id);
      }
    });
});

// show compose_email view
function compose_email() {
  // remove error messages if any
  const errorMessage = document.querySelector(".alert");
  if (errorMessage) errorMessage.remove();

  // Show compose view and hide other views
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#email-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";

  // Clear out composition fields
  document.querySelector("#compose-recipients").value = "";
  document.querySelector("#compose-subject").value = "";
  document.querySelector("#compose-body").value = "";
}

// loads and shows a given mailbox
function load_mailbox(mailbox) {
  // Show the mailbox and hide other views

  const email_views = document.querySelector("#emails-view");
  email_views.style.display = "block";

  document.querySelector("#compose-view").style.display = "none";
  document.querySelector("#email-view").style.display = "none";

  // Show the mailbox name
  document.querySelector("#emails-view").innerHTML = `<h3>${
    mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
  }</h3>`;

  // create headers
  let html = `
    <div class="email-address-header">
      ${mailbox !== "sent" ? "From" : "To"}
    </div>
    <div class="flex-container">
      <div class="email-subject-header">
        Subject
      </div>
    </div>
    <div class="email-time-header">
      ${mailbox !== "sent" ? "Recieved" : "Sent"}
    </div>`;

  let element = document.createElement("div");
  element.innerHTML = html;
  document.querySelector("#emails-view").append(element);
  element.classList.add("email-header");

  // Show emails. Sent async request to server to respective route
  fetch(`/emails/${mailbox}`)
    .then((response) => response.json())
    .then((emails) => {
      // loop over every email
      emails.forEach(function (email) {
        // variables for building html
        let email_address = "";
        if (mailbox !== "sent") {
          email_address = email.sender;
        } else {
          email_address = email.recipients.join(", ");
        }

        const subject = email.subject ? email.subject : "(No subject)";
        const body = email.body ? email.body : "No preview is available.";
        const timestamp = email.timestamp;
        const emailRowClass = email.read == 1 ? "read" : "not-read";
        const id = email.id;

        //  create html for each email
        html = `
        <div class="email-address">
          ${email_address}
        </div>
        <div class="email-subject"> 
            ${subject}
            <span class="email-body">
            ${body}
            </span>
        </div>
        <div class="email-time">
        ${timestamp}
        </div>`;

        // adding email to the dom
        element = document.createElement("div");
        element.innerHTML = html;
        // attach id and class to each mail
        element.dataset.id = id;
        element.classList.add("email-row", `${emailRowClass}`);

        // attach individual function to display mail on click
        // element.addEventListener('click', function() {
        //   displayMail(this.dataset.id);
        // });
        document.querySelector("#emails-view").append(element);
      });
    });
}

// function for sending emails
function sendMail() {
  console.log("hello");

  // removing error message
  const errorMessage = document.querySelector(".alert");
  if (errorMessage) errorMessage.remove();

  // getting data from form
  const recipientsInput = document.querySelector("#compose-recipients");
  const subjectInput = document.querySelector("#compose-subject");
  const bodyInput = document.querySelector("#compose-body");

  const recipients = recipientsInput.value;
  const subject = subjectInput.value;
  const body = bodyInput.value;
  console.log("test");

  // post email
  fetch("/emails", {
    method: "POST",
    // this will be recieved in our backend and converted into a python dictionary
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body,
    }),
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((result) => {
      // get error or success message from response
      if (result.error) {
        // get error message from response
        const message = result.error;
        // create error element
        const element = document.createElement("p");
        // add bootsrap alert class and margin
        element.classList.add("alert", "alert-danger", "mt-2");
        // add message to new created element
        element.innerHTML = message;
        // Add new element to the DOM after recipients Input
        // recipientsInput.parentElement.append(element);
        recipientsInput.closest(".form-group").append(element);
      } else {
        // all went well
        // clean form
        recipientsInput.value = "";
        subjectInput.value = "";
        bodyInput.value = "";
        // load inbox
        load_mailbox("inbox");
      }
    });
}

// function for displaying mails
function displayMail(id) {
  const mailbox = document.querySelector("#emails-view h3").textContent;

  // Show the email view and hide other views

  const email_views = document.querySelector("#emails-view");
  const compose_view = document.querySelector("#compose-view");
  const email_view = document.querySelector("#email-view");

  email_views.style.display = "none";
  compose_view.style.display = "none";
  email_view.style.display = "block";

  // Fetch contents of mail

  fetch(`/emails/${id}`)
    .then((response) => response.json())
    .then((email) => {
      // console.log(email);
      // email info
      const id = email.id;
      const sender = email.sender;
      const recipients =
        email.recipients.length != 1
          ? email.recipients.join(", ")
          : email.recipients[0];
      const subject = email.subject ? email.subject : "(No subject)";
      const body = email.body ? email.body : "(Empty message)";
      const timestamp = email.timestamp;
      const archived = email.archived ? "Unarchive" : "Archive";
      const buttons =
        mailbox !== "Sent"
          ? `<div class="email-buttons"><button id="reply" class="btn btn-sm btn-outline-primary" data-id=${id}>Reply</button><button id="archive" class="btn btn-sm btn-outline-primary" data-id=${id}>${archived}</button></div>`
          : "";

      // Render basic information (header) and body
      email_view.innerHTML = `<div class="email-header-info">
    <p><strong>From: </strong>${sender}</p>
    <p><strong>To: </strong>${recipients}</p>
    <p><strong>Subject: </strong>${subject}</p>
    <p><strong>Timestamp: </strong>${timestamp}</p>
    </div>
    ${buttons}
    <hr>
    <div class="email-body-info">
    <p>${body}</p>
    </div>`;

      // event handlers for reply and archive or unarchive button
      if (buttons) {
        const reply_btn = document.querySelector("#reply");
        const archive_btn = document.querySelector("#archive");

        reply_btn.addEventListener("click", function (e) {
          reply_mail(this.dataset.id);
        });
        archive_btn.addEventListener("click", function (e) {
          archive_mail(this.dataset.id);
        });
      }
    });

  // update read property of mail
  fetch(`/emails/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      read: true,
    }),
  });
}

// function for replying mails
function reply_mail(id) {
  // get email to reply
  fetch(`/emails/${id}`)
    .then((response) => response.json())
    .then((email) => {
      // load compose view
      // Show compose view and hide other views
      document.querySelector("#emails-view").style.display = "none";
      document.querySelector("#email-view").style.display = "none";
      document.querySelector("#compose-view").style.display = "block";

      // Fill compose fields
      const sender = email.sender;
      document.querySelector("#compose-recipients").value = sender;
      const subject = !email.subject.startsWith("Re: ")
        ? `Re: ${email.subject}`
        : email.subject;
      document.querySelector("#compose-subject").value = subject;
      const body = `On ${email.timestamp} ${sender} wrote: ${email.body}`;
      document.querySelector("#compose-body").value = body;
    });
}

// // function for archiving mails
// function archive_mail(id){
//   // get email to check archived property
//   fetch(`/emails/${id}`)
//   .then(response => response.json())
//   .then(email => {
//     const archived = email.archived;

//     // update archived property of mail
//     fetch(`/emails/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify({
//           archived: archived ? false : true
//       })
//     }).then(result => {
//       // load inbox
//       load_mailbox('inbox');
//     });
//   });
// }

// same function as before but fixing callback hell
function archive_mail(id) {
  // get email to check archived property
  fetch(`/emails/${id}`)
    .then((response) => response.json())
    .then((email) => {
      const archived = email.archived;

      // update archived property of mail
      return fetch(`/emails/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          archived: archived ? false : true,
        }),
      });
    })
    .then(() => {
      // load inbox
      load_mailbox("inbox");
    });
}
