let bookLibrary = [
	new Book("Ulysses", "James Joyce", "Modernist novel", 730, "Read"),
	new Book(
		"Harry Potter and the Sorcerer's Stone",
		"J.K. Rowling",
		"Fantasy",
		"234",
		"Unread"
	),
];

const cardContainer = document.querySelector("#cards-container");
const titleField = document.querySelector("#title");
const authorField = document.querySelector("#author");
const genreField = document.querySelector("#genre");
const pageField = document.querySelector("#pages");
const statusBtn = document.querySelectorAll("input[name=read-status]");

const addBookModalBtn = document.querySelector("#add-book-modal");
addBookModalBtn.addEventListener("click", setSubmitBtnValue);

//modal box
const modalBox = document.querySelector(".modal-box");
const addBookBtn = document.querySelector("#add-book");
const closeBtn = document.querySelector("#close-button");
addBookBtn.addEventListener("click", toggleModalBox);
closeBtn.addEventListener("click", () => {
	toggleModalBox();
	emptyField();
});
window.addEventListener("click", windowOnClick);

//modal box
function toggleModalBox() {
	modalBox.classList.toggle("show-modal");
}

//Book constructor
function Book(title, author, genre, pages, status) {
	this.title = title;
	this.author = author;
	this.genre = genre;
	this.pages = pages;
	this.status = status;
}

Book.prototype.changeStatus = function (e) {
	let domCurrentStatus =
		e.target.parentNode.parentNode.childNodes[0].childNodes[3].textContent;
	let cards = document.querySelectorAll(".cards");
	if (this.status === "Read") {
		this.status = "Unread";
		domCurrentStatus = this.status;
	} else {
		this.status = "Read";
		domCurrentStatus = this.status;
	}
	cards.forEach((card) => card.remove());
	showBookLibrary();
};

function setSubmitBtnValue() {
	let statusBtnValue;
	if (statusBtn[0].checked) {
		statusBtnValue = statusBtn[0].value;
	} else if (statusBtn[1].checked) {
		statusBtnValue = statusBtn[1].value;
	} else {
		statusBtnValue = "";
	}
	return checkIfEmptyField(statusBtnValue);
}

function addBookToLibrary(statusBtnValue) {
	//if submit button is pressed add the book to bookLibrary
	bookLibrary.push(
		new Book(
			titleField.value,
			authorField.value,
			genreField.value,
			pageField.value,
			statusBtnValue
		)
	);

	addBookLibrarytoDom();
	emptyField();
}

function windowOnClick(e) {
	if (e.target === modalBox) {
		toggleModalBox();
		emptyField();
	}
}

//check empty field
function checkIfEmptyField(statusBtnValue) {
	if (
		!titleField.value ||
		!authorField.value ||
		!pageField.value ||
		!genreField.value ||
		!statusBtnValue
	) {
		alert("Error");
	} else {
		addBookToLibrary(statusBtnValue);
		toggleModalBox();
	}
}

//empty field when closed
function emptyField() {
	titleField.value = "";
	authorField.value = "";
	pageField.value = "";
	genreField.value = "";
	statusBtn.forEach((status) => (status.checked = false));
}

function addCardtoDom(libraryIndex, title, author, genre, pages, status) {
	let card = document.createElement("div");
	card.classList.toggle("cards");
	card.dataset.libraryIndex = libraryIndex;
	cardContainer.appendChild(card);

	let cardContents = document.createElement("div");
	cardContents.classList.toggle("card-contents");
	card.appendChild(cardContents);

	let firstRowCardContent = document.createElement("div");
	firstRowCardContent.classList.toggle("first-row-card-content");
	cardContents.appendChild(firstRowCardContent);

	let secondRowCardContent = document.createElement("div");
	secondRowCardContent.classList.toggle("second-row-card-content");
	cardContents.appendChild(secondRowCardContent);

	let firstColumnCardContent = document.createElement("div");
	firstColumnCardContent.classList.toggle("first-column-card-content");
	secondRowCardContent.appendChild(firstColumnCardContent);

	let secondColumnCardContent = document.createElement("div");
	secondColumnCardContent.classList.toggle("second-column-card-content");
	secondRowCardContent.appendChild(secondColumnCardContent);

	let titleCard = document.createElement("p");
	titleCard.classList.toggle("title-card");
	titleCard.textContent = title;
	firstRowCardContent.appendChild(titleCard);

	let divClose = document.createElement("div");
	divClose.classList.toggle("delete-card");
	divClose.textContent = "X";
	divClose.addEventListener("click", removeCard);
	firstRowCardContent.appendChild(divClose);

	let authorCard = document.createElement("p");
	authorCard.classList.toggle("author-card");
	authorCard.textContent = author;
	firstColumnCardContent.appendChild(authorCard);

	let genreCard = document.createElement("p");
	genreCard.classList.toggle("genre-card");
	genreCard.textContent = genre;
	firstColumnCardContent.appendChild(genreCard);

	let pageCard = document.createElement("p");
	pageCard.classList.toggle("page-card");
	pageCard.textContent = `${pages} pages`;
	firstColumnCardContent.appendChild(pageCard);

	let statusCard = document.createElement("p");
	statusCard.classList.toggle("status-card");
	statusCard.textContent = status;
	firstColumnCardContent.appendChild(statusCard);

	let markStatusBtn = document.createElement("button");
	if (statusCard.textContent === "Read") {
		markStatusBtn.textContent = "Mark as Unread";
	} else {
		markStatusBtn.textContent = "Mark as Read";
	}
	markStatusBtn.addEventListener(
		"click",
		bookLibrary[libraryIndex].changeStatus.bind(bookLibrary[libraryIndex])
	);

	markStatusBtn.classList.toggle("mark-status-btn");
	secondColumnCardContent.appendChild(markStatusBtn);
}

// show the added book
function addBookLibrarytoDom() {
	addCardtoDom(
		bookLibrary.length - 1,
		bookLibrary[bookLibrary.length - 1].title,
		bookLibrary[bookLibrary.length - 1].author,
		bookLibrary[bookLibrary.length - 1].genre,
		bookLibrary[bookLibrary.length - 1].pages,
		bookLibrary[bookLibrary.length - 1].status
	);
}

function removeCard(e) {
	let index = e.target.parentNode.parentNode.parentNode.dataset.libraryIndex;
	bookLibrary.splice(index, 1);
	e.target.parentNode.parentNode.parentNode.remove();
}

//show the elements of array
function showBookLibrary() {
	let i = 0;
	for (let book of bookLibrary) {
		addCardtoDom(
			i++,
			book.title,
			book.author,
			book.genre,
			book.pages,
			book.status
		);
	}
}

showBookLibrary();
